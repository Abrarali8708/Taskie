

export const adminTableHeadings = ['Name', 'Description', 'Start Date', 'Due Date', 'Completion Date', 'Status', 'User Assigned'];
export const userTableHeadings = ['Name', 'Description', 'Start Date', 'Due Date', 'Completion Date', 'Status'];

type Styles = {
  [key: string]: string;
};

export const getStatusClass = (styles: Styles, status: string): string => {
  const statusClass: { [key: string]: string } = {
    Completed: styles.completed,
    Pending: styles.pending,
    Overdue: styles.overdue,
    'Late Completed': styles.lateCompleted,
    Upcoming: styles.upcoming
  };

  return statusClass[status] || ''; // Return an empty string if status is not found
};

