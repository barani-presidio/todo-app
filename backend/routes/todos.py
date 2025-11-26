from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from bson import ObjectId
from datetime import datetime

from models.todo import TodoCreate, TodoUpdate, TodoResponse
from config.database import get_database

router = APIRouter()


def todo_helper(todo) -> dict:
    return {
        "_id": str(todo["_id"]),
        "title": todo["title"],
        "description": todo.get("description", ""),
        "completed": todo.get("completed", False),
        "priority": todo.get("priority", "medium"),
        "createdAt": todo.get("createdAt", datetime.utcnow()),
        "updatedAt": todo.get("updatedAt", datetime.utcnow())
    }


@router.get("/", response_model=dict)
async def get_todos(
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    sortBy: str = Query(default="createdAt"),
    order: str = Query(default="desc")
):
    try:
        db = get_database()
        filter_query = {}
        
        if completed is not None:
            filter_query["completed"] = completed
        
        if priority:
            filter_query["priority"] = priority
        
        sort_order = -1 if order == "desc" else 1
        
        todos_cursor = db.todos.find(filter_query).sort(sortBy, sort_order)
        todos = await todos_cursor.to_list(length=None)
        
        todos_list = [todo_helper(todo) for todo in todos]
        
        return {
            "success": True,
            "count": len(todos_list),
            "data": todos_list
        }
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Server error while fetching todos",
                "message": str(error)
            }
        )


@router.get("/{id}", response_model=dict)
async def get_todo(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        db = get_database()
        todo = await db.todos.find_one({"_id": ObjectId(id)})
        
        if not todo:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        return {
            "success": True,
            "data": todo_helper(todo)
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Server error while fetching todo",
                "message": str(error)
            }
        )


@router.post("/", response_model=dict, status_code=201)
async def create_todo(todo: TodoCreate):
    try:
        if not todo.title:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": "Title is required"
                }
            )
        
        db = get_database()
        todo_dict = {
            "title": todo.title,
            "description": todo.description or "",
            "completed": False,
            "priority": todo.priority or "medium",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await db.todos.insert_one(todo_dict)
        created_todo = await db.todos.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": todo_helper(created_todo)
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Error creating todo",
                "message": str(error)
            }
        )


@router.put("/{id}", response_model=dict)
async def update_todo(id: str, todo_update: TodoUpdate):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        db = get_database()
        existing_todo = await db.todos.find_one({"_id": ObjectId(id)})
        
        if not existing_todo:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        update_data = {}
        if todo_update.title is not None:
            update_data["title"] = todo_update.title
        if todo_update.description is not None:
            update_data["description"] = todo_update.description
        if todo_update.completed is not None:
            update_data["completed"] = todo_update.completed
        if todo_update.priority is not None:
            update_data["priority"] = todo_update.priority
        
        update_data["updatedAt"] = datetime.utcnow()
        
        await db.todos.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        
        updated_todo = await db.todos.find_one({"_id": ObjectId(id)})
        
        return {
            "success": True,
            "data": todo_helper(updated_todo)
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Error updating todo",
                "message": str(error)
            }
        )


@router.delete("/{id}", response_model=dict)
async def delete_todo(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        db = get_database()
        existing_todo = await db.todos.find_one({"_id": ObjectId(id)})
        
        if not existing_todo:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": "Todo not found"
                }
            )
        
        await db.todos.delete_one({"_id": ObjectId(id)})
        
        return {
            "success": True,
            "message": "Todo deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Server error while deleting todo",
                "message": str(error)
            }
        )

