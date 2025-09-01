import React, { useState, useEffect, useContext } from 'react';
import { Plus, MessageSquare, Paperclip, Eye, ArrowLeft, Users } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';

const KanbanBoard = ({ onBack }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    priority: 'Design', 
    processId: '', 
    assignedRole: null,
    assignedStaff: null 
  });

  useEffect(() => {
    fetchProcesses();
    fetchStaff();
    fetchTasks();
  }, []);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/process/68b50a178953e17238f4e9a7', token);
      const processData = response.data?.processes || [];
      
      // Sort processes by order
      const sortedProcesses = processData
        .filter(process => process.status === 'ACTIVE')
        .sort((a, b) => a.order - b.order);
      
      setProcesses(sortedProcesses);
      console.log('Processes:', sortedProcesses);
    } catch (error) {
      console.error('Error fetching processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await apiClient.get('/staff/staff-list/68b268d5c2e16cd5f5f70c20', token);
      const staffData = response.data?.data || [];
      setStaff(staffData);
      console.log('Staff:', staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks', token);
      const tasksData = response.data?.data || [];
      setTasks(tasksData);
      console.log('Tasks:', tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Keep dummy data if API fails
      setTasks([
        {
          id: 1,
          title: "iOS App home page",
          processId: processes[0]?.assignedRole?.id || "68b268d5c2e16cd5f5f70c20",
          priority: "Design",
          date: "15 Jul 2023",
          assignedRole: "68b268d5c2e16cd5f5f70c20",
          assignedStaff: { name: "John", avatar: "🧑‍💻", color: "bg-blue-500" },
          comments: 12,
          attachments: 8
        }
      ]);
    }
  };

  // Get role ID from process - handle both old and new structure
  const getRoleId = (process) => {
    return typeof process.assignedRole === 'object' 
      ? process.assignedRole.id 
      : process.assignedRole;
  };

  // Get role name from role ID
  const getRoleName = (roleId) => {
    // First try to find in processes with nested structure
    const process = processes.find(p => getRoleId(p) === roleId);
    if (process && typeof process.assignedRole === 'object') {
      return process.assignedRole.staffroll;
    }
    
    // Fallback to roles array if available
    const role = roles.find(r => r._id === roleId || r.id === roleId);
    return role ? role.staffroll : 'Unknown Role';
  };

  // Get staff by role ID
  const getStaffByRole = (roleId) => {
    return staff.filter(s => s.roleId === roleId);
  };

  // Get process name by assigned role
  const getProcessByRole = (roleId) => {
    const process = processes.find(p => getRoleId(p) === roleId);
    return process ? process.process_name : 'Unknown Process';
  };

  // Create dynamic columns based on processes
  const columns = processes.map(process => {
    const roleId = getRoleId(process);
    return {
      id: roleId,
      title: process.process_name.toUpperCase(),
      roleId: roleId,
      order: process.order,
      count: tasks.filter(t => t.processId === roleId || t.assignedRole === roleId).length
    };
  });

  const priorityColors = {
    'Design': 'bg-red-100 text-red-600',
    'Product': 'bg-blue-100 text-blue-600',
    'Checking': 'bg-teal-100 text-teal-600',
    'Development': 'bg-gray-100 text-gray-600',
    'Wordpress': 'bg-green-100 text-green-600',
    'App': 'bg-blue-100 text-blue-600',
    'Web': 'bg-green-100 text-green-600',
    'Banner Design': 'bg-purple-100 text-purple-600'
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newRoleId) => {
    e.preventDefault();
    if (draggedTask) {
      try {
        // Update task in API
        await apiClient.put(`/tasks/${draggedTask.id}`, {
          ...draggedTask,
          processId: newRoleId,
          assignedRole: newRoleId,
          assignedStaff: null // Reset staff assignment when moving to new role
        }, token);

        // Update local state
        setTasks(tasks.map(task =>
          task.id === draggedTask.id 
            ? { ...task, processId: newRoleId, assignedRole: newRoleId, assignedStaff: null }
            : task
        ));
        setDraggedTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
        // Still update local state for demo purposes
        setTasks(tasks.map(task =>
          task.id === draggedTask.id 
            ? { ...task, processId: newRoleId, assignedRole: newRoleId, assignedStaff: null }
            : task
        ));
        setDraggedTask(null);
      }
    }
  };

  const addNewTask = async () => {
    if (newTask.title.trim() && newTask.processId) {
      const task = {
        title: newTask.title,
        processId: newTask.processId,
        assignedRole: newTask.processId,
        priority: newTask.priority,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        assignedStaff: newTask.assignedStaff,
        comments: 0,
        attachments: 0
      };

      try {
        const response = await apiClient.post('/tasks', task, token);
        const createdTask = response.data?.data || { ...task, id: Date.now() };
        setTasks([...tasks, createdTask]);
      } catch (error) {
        console.error('Error creating task:', error);
        // Add with dummy ID for demo
        setTasks([...tasks, { ...task, id: Date.now() }]);
      }

      setNewTask({ title: '', priority: 'Design', processId: '', assignedRole: null, assignedStaff: null });
      setShowAddModal(false);
    }
  };

  const assignStaffToTask = async (taskId, staffMember) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await apiClient.put(`/tasks/${taskId}`, {
        ...task,
        assignedStaff: staffMember
      }, token);

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, assignedStaff: staffMember } : t
      ));
      setShowAssignModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error assigning staff:', error);
      // Update local state anyway for demo
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, assignedStaff: staffMember } : t
      ));
      setShowAssignModal(false);
      setSelectedTask(null);
    }
  };

  const TaskCard = ({ task }) => {
    const roleStaff = getStaffByRole(task.assignedRole);
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-move"
      >
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
            {task.priority}
          </span>
          <span className="text-xs text-gray-500">{task.date}</span>
        </div>

        <h3 className="font-medium text-gray-900 mb-3 text-sm leading-tight">
          {task.title}
        </h3>

        {/* Role Information */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">
            Role: {getRoleName(task.assignedRole)}
          </div>
          {roleStaff.length > 0 && (
            <div className="text-xs text-gray-500">
              Available staff: {roleStaff.length}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-500">
              <MessageSquare size={14} className="mr-1" />
              <span className="text-xs">{task.comments}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Paperclip size={14} className="mr-1" />
              <span className="text-xs">{task.attachments}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Eye size={14} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Staff Assignment Button */}
            <button
              onClick={() => {
                setSelectedTask(task);
                setShowAssignModal(true);
              }}
              className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Assign Staff"
            >
              <Users size={12} className="text-gray-600" />
            </button>

            {/* Assigned Staff Display */}
            {task.assignedStaff ? (
              <div className={`w-8 h-8 ${task.assignedStaff.color || 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-sm`}>
                {task.assignedStaff.avatar || task.assignedStaff.name?.charAt(0)}
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus size={14} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading processes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                    {column.title} ({column.count})
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Role: {getRoleName(column.roleId)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 min-h-96">
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.processId === column.id || task.assignedRole === column.id)
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Process/Column
                  </label>
                  <select
                    value={newTask.processId}
                    onChange={(e) => setNewTask({ ...newTask, processId: e.target.value, assignedRole: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Process</option>
                    {processes.map((process) => {
                      const roleId = getRoleId(process);
                      const roleName = getRoleName(roleId);
                      return (
                        <option key={roleId} value={roleId}>
                          {process.process_name} - {roleName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Product">Product</option>
                    <option value="Checking">Checking</option>
                  </select>
                </div>

                {/* Show available staff for selected role */}
                {newTask.processId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Staff (Role: {getRoleName(newTask.processId)})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getStaffByRole(newTask.processId).map((staffMember) => (
                        <button
                          key={staffMember._id}
                          onClick={() => setNewTask({ ...newTask, assignedStaff: staffMember })}
                          className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                            newTask.assignedStaff?._id === staffMember._id
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {staffMember.name}
                        </button>
                      ))}
                      <button
                        onClick={() => setNewTask({ ...newTask, assignedStaff: null })}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          !newTask.assignedStaff
                            ? 'bg-gray-500 text-white border-gray-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        Unassigned
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addNewTask}
                  disabled={!newTask.title.trim() || !newTask.processId}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTask({ title: '', priority: 'Design', processId: '', assignedRole: null, assignedStaff: null });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Staff Assignment Modal */}
        {showAssignModal && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Assign Staff to Task</h3>
              <p className="text-sm text-gray-600 mb-4">
                Task: {selectedTask.title}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Role: {getRoleName(selectedTask.assignedRole)}
              </p>

              <div className="space-y-3">
                {getStaffByRole(selectedTask.assignedRole).map((staffMember) => (
                  <button
                    key={staffMember._id}
                    onClick={() => assignStaffToTask(selectedTask.id, staffMember)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {staffMember.avatar || staffMember.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staffMember.name}</p>
                        <p className="text-sm text-gray-500">{staffMember.email}</p>
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => assignStaffToTask(selectedTask.id, null)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Plus size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Unassigned</p>
                      <p className="text-sm text-gray-500">Remove staff assignment</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;