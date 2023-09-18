const formateDateTime = (date: string) => {
    if (date) {
        const currentDate = new Date(date);
    
        // Format the date as Mmm D, YYYY (e.g., Jul 8, 2023)
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    
        // Format the time as H:mm AM/PM (e.g., 9:28 AM)
        const formattedTime = currentDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    
        // Create the object with the separated date and time
        return {
            date: formattedDate ?? ' - ',
            time: formattedTime ?? ' - ' ,
        };
    } else {
        return " - "
    }
}

export default formateDateTime;