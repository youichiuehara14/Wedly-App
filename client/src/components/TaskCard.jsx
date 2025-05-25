import { useSortable } from '@dnd-kit/sortable';
import { getDragStyle } from '../utils/dragStyle.js';
import { colorToHex } from '../utils/colorMap.js';

const TaskCard = ({ task, id, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
  });

  const hexColor = colorToHex[task.taskColor] || '#D1D5DB';

  const style = getDragStyle(transform, transition, isDragging);

  const currentDate = new Date('2025-05-23T01:35:00-07:00');
  const dueDate = new Date(task.dueDate);
  const timeDiff = dueDate - currentDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const daysLeftText =
    dueDate > currentDate ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'Overdue';

  const completionPercentage = task.checklists?.length
    ? (task.checklists.filter((item) => item.isCompleted).length / task.checklists.length) * 100
    : 0;

  const priorityBgColor =
    task.priority === 'High'
      ? 'bg-red-400'
      : task.priority === 'Medium'
      ? 'bg-yellow-600'
      : task.priority === 'Low'
      ? 'bg-green-400'
      : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick && onClick(task)}
      className="bg-white border-2 text-black p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 rounded-lg shadow-lg hover:shadow-xl cursor-pointer border-[#ddddddc7] mt-3  "
    >
      <div className="relative">
        <div
          className="w-4 sm:w-3 h-5 mb-2 absolute -top-6 "
          style={{ backgroundColor: hexColor }}
        ></div>
        <p className={` text-[13px] w-15 text-center text-white mb-2 ml-auto ${priorityBgColor}`}>
          {task.priority}
        </p>

        <div className="flex flex-col">
          <p className="text-black font-semibold text-sm sm:text-base flex-1">{task.title}</p>
          <p className="text-[13px] text-black font-semibold">{task.category}</p>
        </div>
        <div className="mt-2">
          <div className="text-xs text-black mb-1">
            Progress: {Math.round(completionPercentage)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center mt-2 justify-between">
          <p className="text-black text-xs sm:text-sm ">
            Php{' '}
            {isNaN(Number(task.cost)) || task.cost === null || task.cost === undefined
              ? '0.00'
              : Number(task.cost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </p>

          <p
            className={`text-[11px] font-medium ${
              dueDate > currentDate
                ? daysLeft <= 7
                  ? 'text-orange-400 font-bold'
                  : 'text-black'
                : 'text-red-500 font-bold'
            }`}
          >
            {daysLeftText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
