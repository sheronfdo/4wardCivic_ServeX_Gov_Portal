import React, { useState } from 'react';
import { Search, Filter, ChevronDown, AlertTriangle } from 'lucide-react';

const Task = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

    const serviceRequests = [
        {
            id: '113',
            userName: 'Jenifer stinge',
            serviceName: 'Permit Application',
            submittedDate: '2024-07-15',
            status: 'Pending',
            statusColor: 'bg-blue-100 text-blue-800'
        },
        {
            id: '112',
            userName: 'Jenifer stinge',
            serviceName: 'Permit Application',
            submittedDate: '2024-07-15',
            status: 'In progress',
            statusColor: 'bg-orange-100 text-orange-800'
        },
        {
            id: '111',
            userName: 'Jenifer stinge',
            serviceName: 'Permit Application',
            submittedDate: '2024-07-12',
            status: 'In progress',
            statusColor: 'bg-orange-100 text-orange-800'
        },
        {
            id: '110',
            userName: 'Jenifer stinge',
            serviceName: 'Permit Application',
            submittedDate: '2024-07-10',
            status: 'Done',
            statusColor: 'bg-green-100 text-green-800'
        },
        {
            id: '109',
            userName: 'Jenifer stinge',
            serviceName: 'Permit Application',
            submittedDate: '2024-07-15',
            status: 'Pending',
            statusColor: 'bg-blue-100 text-blue-800'
        }
    ];

    const filteredRequests = serviceRequests.filter(request => {
        const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.includes(searchTerm) ||
            request.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || request.status === statusFilter;
        const matchesServiceType = !serviceTypeFilter || request.serviceName === serviceTypeFilter;

        return matchesSearch && matchesStatus && matchesServiceType;
    });

    const handleUpdateStatus = (id) => {
        setCurrentRequestId(id);
        setIsUpdateFormVisible(true);
    };

    const handleSubmit = () => {
        // Handle the status update logic here
        console.log('Updating status for request:', currentRequestId, 'New status:', newStatus);
        setIsUpdateFormVisible(false);
    };

    const handleClose = () => {
        setIsUpdateFormVisible(false);
    };

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">View User Submitted Service Requests</h1>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or service..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Filter Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>

                {/* Service Type Filter */}
                <div className="relative min-w-[180px]">
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        value={serviceTypeFilter}
                        onChange={(e) => setServiceTypeFilter(e.target.value)}
                    >
                        <option value="">Filter Service Type</option>
                        <option value="Permit Application">Permit Application</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Request ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRequests.map((request, index) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {request.id === '110' && (
                                                    <div className="relative mr-2">
                                                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full"></div>
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-gray-900">{request.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {request.userName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {request.serviceName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {request.submittedDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.statusColor}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleUpdateStatus(request.id)}
                                                className="text-blue-600 hover:text-blue-800 font-medium">
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden">
                        {filteredRequests.map((request) => (
                            <div key={request.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center">
                                        {request.id === '110' && (
                                            <div className="relative mr-2">
                                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full"></div>
                                            </div>
                                        )}
                                        <span className="font-semibold text-gray-900">#{request.id}</span>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.statusColor}`}>
                                        {request.status}
                                    </span>
                                </div>

                                <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-900">
                                        <span className="font-medium">User:</span> {request.userName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Service:</span> {request.serviceName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Date:</span> {request.submittedDate}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleUpdateStatus(request.id)}
                                    className="text-blue-600 hover:text-blue-800 font-medium">
                                    Update Status
                                </button>
                            </div>
                        ))}
                    </div>


                    {/* Update Status Form */}
                    {isUpdateFormVisible && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Update Status</h3>
                                <p className="text-sm mb-4 text-gray-600">
                                    Current Status: <span className="font-medium text-gray-800">
                                        {filteredRequests.find(req => req.id === currentRequestId)?.status}
                                    </span>
                                </p>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                >
                                    <option className="rounded-lg" value="">Select New Status</option>
                                    <option className="rounded-lg" value="Pending">Pending</option>
                                    <option className="rounded-lg" value="In progress">In Progress</option>
                                    <option className="rounded-lg" value="Done">Done</option>
                                </select>
                                <div className="flex justify-end gap-2">
                                    <button onClick={handleClose}  className="text-gray-900">Cancel</button>
                                    <button onClick={handleSubmit} disabled={!newStatus} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-all duration-200">Update</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredRequests.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Filter className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Footer */}
                    {filteredRequests.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                            Showing {filteredRequests.length} of {serviceRequests.length} requests
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Task;