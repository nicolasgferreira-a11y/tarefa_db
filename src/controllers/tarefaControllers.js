const db = require('../config/database');

// 1. Criar Tarefa (Inclusão)
exports.criarTarefa = async (req, res) => {
    try {
        const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;
        
        if (!nome || !responsavel || !data_tarefa) {
            return res.status(400).json({ mensagem: 'Campos nome, responsavel e data_tarefa são obrigatórios.' });
        }

        const sql = 'INSERT INTO tarefas (nome, descricao, responsavel, data_tarefa, concluido) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [nome, descricao, responsavel, data_tarefa, concluido || false]);

        return res.status(201).json({
            id: result.insertId,
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido: concluido || false
        });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno ao criar tarefa.', erro: error.message });
    }
};

// 2. Buscar por ID (Consulta)
exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM tarefas WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao buscar tarefa.', erro: error.message });
    }
};

// 3. Listar por Período
exports.listarPorPeriodo = async (req, res) => {
    try {
        const { data_inicio, data_fim } = req.query;

        if (!data_inicio || !data_fim) {
            return res.status(400).json({ mensagem: 'Por favor, informe data_inicio e data_fim na URL.' });
        }

        const sql = 'SELECT * FROM tarefas WHERE data_tarefa BETWEEN ? AND ? ORDER BY data_tarefa ASC';
        const [rows] = await db.execute(sql, [data_inicio, data_fim]);

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao listar tarefas por período.', erro: error.message });
    }
};

// 4. Atualizar Tarefa
exports.atualizarTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;

        const [check] = await db.execute('SELECT * FROM tarefas WHERE id = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada para atualização.' });
        }

        const sql = 'UPDATE tarefas SET nome = ?, descricao = ?, responsavel = ?, data_tarefa = ?, concluido = ? WHERE id = ?';
        await db.execute(sql, [nome, descricao, responsavel, data_tarefa, concluido, id]);

        return res.status(200).json({ mensagem: 'Tarefa atualizada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar tarefa.', erro: error.message });
    }
};

// 5. Excluir Tarefa
exports.deletarTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM tarefas WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada para exclusão.' });
        }

        return res.status(200).json({ mensagem: 'Tarefa excluída com sucesso.' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao excluir tarefa.', erro: error.message });
    }
};