// import { Task } from "@/app/(tasks)/your-tasks/my-task";

import { Task } from "@/app/(tasks)/your-tasks/my-task";

// const fetchWorkroomDetails = async (
//   workroomId: string | null,
//   backendUri: string | undefined,
//   setTasks?: React.Dispatch<React.SetStateAction<Task[]>>
// ) => {
//   if (!workroomId) return;

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("No authentication token found");

//     if (!backendUri) throw new Error("Backend URI is not defined");
//     const response = await fetch(
//       `${backendUri}/api/v1/workrooms/${workroomId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch workroom details");

//     const data = await response.json();
//     setTasks && setTasks(data.tasks || []);
//   } catch (error) {
//     console.error("Error fetching workroom details:", error);
//   }
// };

// export default fetchWorkroomDetails;

export interface Member {
  id: string;
  created_at: string;
  updated_at: string;
  auth_provider: string;
  username: string;
  name: string;
  image_url: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role: string;
  xp: number;
  level: number;
  avatar_url: string;
  is_verified: boolean;
  is_user_onboarded: boolean;
  productivity: number;
  average_task_time: number;
  user_type: string;
  find_us: string;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  software_used: string[];
}

export interface Metric {
  metric_name: string;
  metric_value: number;
}

export interface WorkroomDetails {
  id: string;
  name: string;
  created_by: string;
  kpis: string;
  metrics: Metric[];
  tasks: Task[];
  performance_metrics: {
    kpi_name: string;
    metric_value: number;
    weight: number;
  }[];
  members: Member[];
}

const fetchWorkroomDetails = async (
  workroomId: string | null,
  backendUri: string | undefined
) => {
  if (!workroomId) {
    console.warn("Workroom ID is null or undefined. Cannot fetch details.");
    return null; // Or throw an error, depending on your error handling policy
  }

  if (!backendUri) {
    const errorMessage =
      "Backend URI is not defined. Cannot fetch workroom details.";
    console.error(errorMessage);
    throw new Error(errorMessage); // Explicitly throw error to stop execution
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      const errorMessage = "No authentication token found.  Please log in.";
      console.error(errorMessage);
      throw new Error(errorMessage); //  Explicitly throw error
    }

    const response = await fetch(
      `${backendUri}/api/v1/workrooms/${workroomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      const errorMessage = `Failed to fetch workroom details. Status: ${response.status},  Body: ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage); // Include status and body in error
    }

    const data: WorkroomDetails = await response.json();
    return data; // Return the entire data object
    console.log(data);
  } catch (error) {
    //  IMPORTANT:  Don't just log.  RETHROW the error.
    console.error("Error fetching workroom details:", error);
    throw error; // Re-throw to allow caller to handle it.
  }
};

export default fetchWorkroomDetails;
