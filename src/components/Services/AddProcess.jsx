import { useState, useEffect, useContext } from 'react';
import apiClient from '../../utils/apiClient';
import { AuthContext } from '../../context/AuthContext';

const ProcessRoleForm = ({ processData, setProcessData }) => {
    const [rolls, setRolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchRolls();
    }, []);

    const fetchRolls = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/staff/rolls', token);
            const rollsData = response.rolls || [];
            setRolls(rollsData);
        } catch (error) {
            console.error('Error fetching rolls:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding a new process
    const addProcess = () => {
        setProcessData([...processData, { process: '', role: '' }]);
    };

    // Handle removing a process
    const removeProcess = (index) => {
        const updatedProcesses = processData.filter((_, i) => i !== index);
        setProcessData(updatedProcesses);
    };

    // Handle input changes for process name or role
    const handleInputChange = (index, field, value) => {
        const updatedProcesses = [...processData];
        updatedProcesses[index][field] = value;
        setProcessData(updatedProcesses);
    };

    return (
        <div className="grid lg:gap-6">
            {processData.map((proc, index) => (
                <div key={index} className="flex items-center space-x-4">
                    {/* Process Input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Process {index + 1}
                        </label>
                        <input
                            type="text"
                            value={proc.process}
                            onChange={(e) => handleInputChange(index, 'process', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                            placeholder="e.g., Create App"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign Role
                        </label>
                        <select
                            required
                            value={proc.role}
                            onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Roll</option>
                            {rolls.map((roll) => (
                                <option key={roll.id} value={roll.id}>
                                    {roll.staffroll}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Remove Button */}
                    {processData.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeProcess(index)}
                            className="mt-8 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            {/* Add Process Button */}
            <div className="col-span-full">
                <button
                    type="button"
                    onClick={addProcess}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add Process
                </button>
            </div>
        </div>
    );
};

export default ProcessRoleForm;