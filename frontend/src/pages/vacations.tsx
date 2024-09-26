import Sidebar from '../components/Sidebar';
import HomeLayout from '../layouts/PrivateLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { useEffect, useState } from 'react';
import { EventClickArg } from '@fullcalendar/core/index.js';

/**
 * Page component for the vacations page.
 */
const Vacations: React.FC = () => {
    const [events, setEvents] = useState<Array<{ title: string, date: string }>>([]);
    const handleDateClick = (arg: { dateStr: string }) => {
        const title = prompt('Please enter a new title for your event');
        if (title) {
            setEvents([...events, { title, date: arg.dateStr }]);
        }
    }

    useEffect(() => {
        const buttons = document.querySelectorAll('.fc-button');
        buttons.forEach(button => {
            button.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
        });
    }, []);
    const handleEventClick = (arg: EventClickArg) => {
        const event = arg.event;
        const title = event.title;
        const date = event.start?.toISOString();
        if (confirm(`Are you sure you want to delete the event '${title}'`)) {
            setEvents(events.filter((event) => event.date !== date));
        }
    }
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <h1 className="mb-4 text-3xl font-bold">Vacations</h1>

            {/* Add more content or components here */}
            <FullCalendar
                plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
                initialView="multiMonthYear"
                events={events}
                dateClick={handleDateClick}
                weekNumbers={true}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth'
                }}
                eventClick={(arg) => handleEventClick(arg)}
                dayMaxEvents={true}
            />
        </HomeLayout>
    );
};
export default Vacations;