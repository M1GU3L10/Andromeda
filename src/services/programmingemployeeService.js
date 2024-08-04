const programmingEmployeeRepository = require('../repositories/programmingEmployeeRepository');

const getAllProgrammingemployees = async () => {
    return await programmingEmployeeRepository.getAllProgrammingemployees();
};

const getProgrammingemployeesById = async (id) => {
    return await programmingEmployeeRepository.getProgrammingemployeesById(id);
};

const createProgrammingemployees = async (data) => {
    return await programmingEmployeeRepository.createProgrammingemployees(data);
};

const updateProgrammingemployees = async (id, data) => {
    return await programmingEmployeeRepository.updateProgrammingemployees(id, data);
};

const deleteprogrammingEmployee = async (id) => {
    return await programmingEmployeeRepository.deleteProgrammingemployees(id);
};

module.exports = {
    getAllProgrammingemployees,
    getProgrammingemployeesById,
    createProgrammingemployees,
    updateProgrammingemployees,
    deleteprogrammingEmployee
};