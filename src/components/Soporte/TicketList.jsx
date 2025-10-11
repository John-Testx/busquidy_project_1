import React from "react";
import TicketCard from "./TicketCard";

function TicketList({ tickets, isPublic = false, guestEmail = null }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tienes solicitudes en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard 
          key={ticket.id_ticket} 
          ticket={ticket}
          isPublic={isPublic}
          guestEmail={guestEmail}
        />
      ))}
    </div>
  );
}

export default TicketList;