import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import { fetchTasks, updateTaskStatus, createTask, deleteTask, updateTask, clearError, clearSuccess } from "../features/task.Slice";
import Toast from "../components/Toast";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { tasks, loading, error, success } = useSelector((state) => state.tasks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    tags: ""
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({});
  const [users, setUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(fetchTasks());
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setToastMessage(success);
      setToastType("success");
    }
  }, [success]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/v1/users/all', { withCredentials: true });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      dispatch(logout());
      setToastMessage("Logged out successfully");
      setToastType("success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleStatusChange = (taskId, status) => {
    dispatch(updateTaskStatus({ taskId, status }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Validation
    const errors = {};
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
    }
    if (newTask.dueDate && isNaN(new Date(newTask.dueDate).getTime())) {
      errors.dueDate = "Please enter a valid date";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      assignedTo: newTask.assignedTo,
      tags: newTask.tags.split(",").map(tag => tag.trim())
    };
    if (newTask.dueDate) {
      taskData.dueDate = new Date(newTask.dueDate);
    }
    dispatch(createTask(taskData));
    setShowCreateForm(false);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      tags: ""
    });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      assignedTo: task.assignedTo?._id || "",
      tags: task.tags ? task.tags.join(", ") : ""
    });
  };

  const handleSaveEdit = () => {
    const updates = {
      ...editTask,
      tags: editTask.tags.split(",").map(tag => tag.trim()),
      dueDate: editTask.dueDate ? new Date(editTask.dueDate) : undefined
    };
    dispatch(updateTask({ taskId: editingTaskId, updates }));
    setEditingTaskId(null);
    setEditTask({});
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTask({});
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-24 p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow Dashboard
          </h1>
          <p className="text-gray-600 mt-1 font-semibold">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex space-x-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {showCreateForm ? '✕ Cancel' : '➕ Create Task'}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <Toast message={toastMessage} type={toastType} onClose={() => { setToastMessage(""); dispatch(clearError()); dispatch(clearSuccess()); }} />

      {showCreateForm && (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 mb-8 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create New Task</h2>
          </div>
          <form onSubmit={handleCreateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {validationErrors.title && <p className="text-red-500 text-sm">{validationErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {validationErrors.dueDate && <p className="text-red-500 text-sm">{validationErrors.dueDate}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">👤 Select User</option>
                  {users.filter(u => u.role !== 'admin').map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  rows="4"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                ✨ Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Loading your tasks...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
              {editingTaskId === task._id ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg mr-3">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Edit Task</h3>
                  </div>
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-semibold"
                    placeholder="Title"
                  />
                  <textarea
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-600 resize-none"
                    rows="3"
                    placeholder="Description"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={editTask.priority}
                      onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                    <input
                      type="date"
                      value={editTask.dueDate}
                      onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>
                  <select
                    value={editTask.assignedTo}
                    onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                  >
                    <option value="">👤 Select User</option>
                    {users.filter(u => u.role !== 'admin').map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editTask.tags}
                    onChange={(e) => setEditTask({ ...editTask, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    placeholder="Tags (comma separated)"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'completed' ? '✅' :
                       task.status === 'in-progress' ? '🔄' :
                       task.status === 'on-hold' ? '⏸️' : '⏳'} {task.status}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {task.assignedTo && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Assigned to: {task.assignedTo.name}
                      </div>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium border border-indigo-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {user?.role === 'user' && task.assignedTo?._id === user._id && (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in-progress">🔄 In Progress</option>
                        <option value="completed">✅ Completed</option>
                        <option value="on-hold">⏸️ On Hold</option>
                      </select>
                    )}
                    {user?.role === 'admin' && task.createdBy._id === user._id && (
                      <button
                        onClick={() => handleEditTask(task)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;