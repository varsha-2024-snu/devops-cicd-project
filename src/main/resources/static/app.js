(function () {
    "use strict";

    const state = { tasks: [], editingId: null, modalTrigger: null };
    const $ = (id) => document.getElementById(id);
    const elements = {
        list: $("taskList"), form: $("taskForm"), modal: $("taskModal"), title: $("titleInput"),
        description: $("descriptionInput"), status: $("statusInput"), taskId: $("taskId"),
        search: $("searchInput"), filter: $("statusFilter"), save: $("saveButton")
    };

    async function request(url, options) {
        const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
        if (!response.ok) {
            let message = `Request failed (${response.status})`;
            try {
                const error = await response.json();
                if (error.message) message = error.message;
                else if (error.errors) message = Object.values(error.errors).join(", ");
            } catch (_) { /* use the HTTP status when the server has no JSON error body */ }
            throw new Error(message);
        }
        return response.status === 204 ? null : response.json();
    }

    async function loadTasks() {
        showLoading();
        try {
            state.tasks = await request("/api/tasks");
            updateStats();
            renderTasks();
        } catch (error) {
            showError("Could not load tasks", error.message);
            toast(error.message, "error");
        }
    }

    async function checkHealth() {
        const pill = $("healthPill");
        try {
            const health = await request("/api/health");
            const isUp = health.status === "UP";
            $("healthText").textContent = isUp ? "API connected" : "API degraded";
            $("footerVersion").textContent = health.version ? `v${health.version}` : "online";
            pill.classList.toggle("error", !isUp);
        } catch (_) {
            $("healthText").textContent = "API unavailable";
            $("footerVersion").textContent = "connection failed";
            pill.classList.add("error");
        }
    }

    function updateStats() {
        const count = (status) => state.tasks.filter((task) => task.status === status).length;
        $("totalCount").textContent = state.tasks.length;
        $("todoCount").textContent = count("TODO");
        $("progressCount").textContent = count("IN_PROGRESS");
        $("completedCount").textContent = count("COMPLETED");
    }

    function renderTasks() {
        const query = elements.search.value.trim().toLowerCase();
        const filter = elements.filter.value;
        const visible = state.tasks.filter((task) =>
            (!query || String(task.title || "").toLowerCase().includes(query) || (task.description || "").toLowerCase().includes(query)) &&
            (filter === "ALL" || task.status === filter)
        );
        if (!visible.length) {
            elements.list.innerHTML = `<div class="empty-state"><div class="empty-icon">✓</div><p>${state.tasks.length ? "No matching tasks" : "Your workspace is clear"}</p><small>${state.tasks.length ? "Try changing your search or filter." : "Create a task or load the demo set to get started."}</small></div>`;
            return;
        }
        elements.list.innerHTML = visible.map(taskRow).join("");
        elements.list.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => openModal(Number(button.dataset.edit))));
        elements.list.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteTask(Number(button.dataset.delete))));
    }

    function taskRow(task) {
        const status = task.status || "TODO";
        const statusLabel = { TODO: "To do", IN_PROGRESS: "In progress", COMPLETED: "Completed" }[status] || status;
        const statusClass = { TODO: "status-todo", IN_PROGRESS: "status-progress", COMPLETED: "status-completed" }[status] || "status-todo";
        const dateValue = task.createdAt ? new Date(task.createdAt) : null;
        const date = dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Recently added";
        return `<article class="task-row"><div><div class="task-title">${escapeHtml(task.title)}</div><div class="task-description">${escapeHtml(task.description || "No description added")}</div></div><div><span class="status-badge ${statusClass}">${escapeHtml(statusLabel)}</span></div><div class="task-date">${escapeHtml(date)}</div><div class="task-actions"><button class="icon-button" data-edit="${task.id}" title="Edit task" aria-label="Edit ${escapeHtml(task.title)}">✎</button><button class="icon-button delete" data-delete="${task.id}" title="Delete task" aria-label="Delete ${escapeHtml(task.title)}">⌫</button></div></article>`;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
    }

    function openModal(id, trigger) {
        state.editingId = id || null;
        state.modalTrigger = trigger || document.activeElement;
        const task = id ? state.tasks.find((item) => item.id === id) : null;
        $("modalKicker").textContent = task ? "EDIT TASK" : "NEW TASK";
        $("modalTitle").textContent = task ? "Update task details" : "Create a new task";
        $("saveButton").textContent = task ? "Save changes" : "Create task";
        elements.taskId.value = task ? task.id : "";
        elements.title.value = task ? task.title : "";
        elements.description.value = task ? (task.description || "") : "";
        elements.status.value = task ? (task.status || "TODO") : "TODO";
        $("titleError").textContent = "";
        elements.modal.hidden = false;
        document.body.style.overflow = "hidden";
        setTimeout(() => elements.title.focus(), 0);
    }

    function closeModal() {
        elements.modal.hidden = true;
        document.body.style.overflow = "";
        state.editingId = null;
        const trigger = state.modalTrigger;
        state.modalTrigger = null;
        if (trigger && document.contains(trigger)) trigger.focus();
    }

    async function saveTask(event) {
        event.preventDefault();
        const title = elements.title.value.trim();
        if (!title) { $("titleError").textContent = "A title is required."; elements.title.focus(); return; }
        const isEditing = Boolean(state.editingId);
        const payload = { title, description: elements.description.value.trim() || null, status: elements.status.value };
        elements.save.disabled = true;
        elements.save.textContent = "Saving…";
        try {
            if (isEditing) await request(`/api/tasks/${state.editingId}`, { method: "PUT", body: JSON.stringify(payload) });
            else await request("/api/tasks", { method: "POST", body: JSON.stringify(payload) });
            closeModal();
            await loadTasks();
            toast(isEditing ? "Task updated successfully." : "Task created successfully.", "success");
        } catch (error) {
            toast(error.message, "error");
        } finally {
            elements.save.disabled = false;
            elements.save.textContent = isEditing ? "Save changes" : "Create task";
        }
    }

    async function deleteTask(id) {
        const task = state.tasks.find((item) => item.id === id);
        if (!task || !window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
        try {
            await request(`/api/tasks/${id}`, { method: "DELETE" });
            await loadTasks();
            toast("Task deleted.", "success");
        } catch (error) { toast(error.message, "error"); }
    }

    async function loadDemoTasks() {
        const demo = [
            { title: "Prepare project documentation", description: "Finalize the architecture and setup guide for the evaluation.", status: "TODO" },
            { title: "Test CI/CD pipeline", description: "Confirm the build, container publish, and deployment workflow.", status: "IN_PROGRESS" },
            { title: "Deploy application to Azure", description: "Verify the live Task Manager deployment and health endpoint.", status: "COMPLETED" },
            { title: "Demonstrate task management", description: "Walk through creating, editing, searching, and deleting tasks.", status: "TODO" }
        ];
        const existingTitles = new Set(state.tasks.map((task) => task.title));
        const pending = demo.filter((task) => !existingTitles.has(task.title));
        if (!pending.length) { toast("Demo tasks are already loaded.", "success"); return; }
        $("demoButton").disabled = true;
        try {
            await Promise.all(pending.map((task) => request("/api/tasks", { method: "POST", body: JSON.stringify(task) })));
            await loadTasks();
            toast(`${pending.length} demo task${pending.length === 1 ? "" : "s"} added.`, "success");
        } catch (error) { toast(`Demo data could not be loaded: ${error.message}`, "error"); }
        finally { $("demoButton").disabled = false; }
    }

    function showLoading() { elements.list.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading your tasks…</p></div>'; }
    function showError(title, message) { elements.list.innerHTML = `<div class="error-state"><p>${escapeHtml(title)}</p><small>${escapeHtml(message)} · <button class="secondary-button" id="retryButton">Retry</button></small></div>`; $("retryButton").addEventListener("click", loadTasks); }
    function toast(message, type) { const item = document.createElement("div"); item.className = `toast ${type}`; item.textContent = message; $("toastContainer").appendChild(item); setTimeout(() => item.remove(), 4000); }

    $("newTaskButton").addEventListener("click", (event) => openModal(null, event.currentTarget));
    $("closeModal").addEventListener("click", closeModal);
    $("cancelButton").addEventListener("click", closeModal);
    elements.modal.addEventListener("click", (event) => { if (event.target === elements.modal) closeModal(); });
    elements.form.addEventListener("submit", saveTask);
    elements.search.addEventListener("input", renderTasks);
    elements.filter.addEventListener("change", renderTasks);
    $("refreshButton").addEventListener("click", () => { loadTasks(); checkHealth(); });
    $("demoButton").addEventListener("click", loadDemoTasks);
    $("mobileMenu").addEventListener("click", () => {
        const sidebar = document.querySelector(".sidebar");
        const isOpen = sidebar.classList.toggle("open");
        $("mobileMenu").setAttribute("aria-expanded", String(isOpen));
    });
    document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.remove("open");
        $("mobileMenu").setAttribute("aria-expanded", "false");
    }));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !elements.modal.hidden) closeModal(); });
    checkHealth();
    loadTasks();
}());
