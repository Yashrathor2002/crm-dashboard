import { useEffect } from "react";
import { fetchTasks } from "../api/tasks";

const useNotifications = () => {
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") return;

      const checkDueTasks = async () => {
        try {
          const { data: tasks } = await fetchTasks({ status: "pending" });
          const now = new Date();

          tasks.forEach((task) => {
            if (!task.dueDate) return;
            const due = new Date(task.dueDate);
            const diffMs = due - now;
            const diffHrs = diffMs / (1000 * 60 * 60);

            if (diffHrs > 0 && diffHrs <= 24) {
              new Notification(`Task due soon: ${task.title}`, {
                body: `Due: ${due.toLocaleDateString()} — Priority: ${task.priority}`,
                icon: "/vite.svg",
              });
            }
          });
        } catch (err) {
          console.error(err);
        }
      };

      checkDueTasks();
      const interval = setInterval(checkDueTasks, 60 * 60 * 1000);
      return () => clearInterval(interval);
    });
  }, []);
};

export default useNotifications;
