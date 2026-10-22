const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaControllers');

// Definição das rotas do CRUD
router.post('/tarefas', tarefaController.criarTarefa);
router.get('/tarefas/periodo', tarefaController.listarPorPeriodo);
router.get('/tarefas/:id', tarefaController.buscarPorId);
router.put('/tarefas/:id', tarefaController.atualizarTarefa);
router.delete('/tarefas/:id', tarefaController.deletarTarefa);

module.exports = router;