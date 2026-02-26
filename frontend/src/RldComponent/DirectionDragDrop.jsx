// src/RldComponent/DirectionDragDrop.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
export default function DirectionDragDrop({ items, setItems }) {
  const directions = ["North", "South", "East", "West"];

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newItems = items.map((item) =>
      item.id === draggableId
        ? { ...item, assignedDirection: destination.droppableId }
        : item,
    );

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 gap-4">
        {directions.map((dir) => (
          <Droppable droppableId={dir} key={dir}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 border-2 border-blue-400 rounded h-40 flex flex-col items-center justify-center"
              >
                <h3 className="mb-2 font-bold">{dir}</h3>
                {items
                  .filter((i) => i.assignedDirection === dir)
                  .map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-200 p-2 m-1 rounded w-full text-center"
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>

      <Droppable droppableId="unassigned">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-4 p-4 border-2 border-gray-400 rounded min-h-[100px]"
          >
            <h3 className="mb-2 font-bold">Unassigned Items</h3>
            {items
              .filter((i) => !i.assignedDirection)
              .map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-200 p-2 m-1 rounded w-full text-center"
                    >
                      {item.name}
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
