import { Task } from "@/app/(tasks)/your-tasks/my-task";

type FetchTaskProps = {
  setLoadingTasks: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorTasks: React.Dispatch<React.SetStateAction<string | null>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const fetchTasks = async ({
  setLoadingTasks,
  setErrorTasks,
  setTasks,
}: FetchTaskProps) => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    console.log("No token found in localStorage, cannot fetch tasks.");
    setLoadingTasks(false);
    return;
  }

  setLoadingTasks(true);
  setErrorTasks(null);

  try {
    const response = await fetch(
      `https://hudddle-backend.onrender.com/api/v1/tasks?page=1&page_size=1000`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch tasks: ${response.status} - ${
          errorData?.message || response.statusText
        }`
      );
    }

    const data: Task[] = await response.json();
    console.log(`Task Data: ${JSON.stringify(data, null, 2)}`);
    setTasks(data);
  } catch (err: any) {
    setErrorTasks(err.message);
    console.error("Error fetching tasks:", err);
    setTasks([]);
  } finally {
    setLoadingTasks(false);
  }
};

export default fetchTasks;
