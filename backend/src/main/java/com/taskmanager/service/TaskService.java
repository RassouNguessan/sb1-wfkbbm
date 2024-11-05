package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(task.getTitle());
                    existingTask.setDescription(task.getDescription());
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task toggleTask(Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setDisabled(!task.isDisabled());
                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
    }

    @Transactional
    public void bulkDisable(List<Long> ids) {
        taskRepository.updateDisabledStatus(ids, true);
    }

    @Transactional
    public void bulkDelete(List<Long> ids) {
        taskRepository.deleteAllById(ids);
    }
}