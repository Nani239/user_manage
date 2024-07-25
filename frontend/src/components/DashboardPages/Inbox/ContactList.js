// ContactList.js
import React from "react";
import { ListGroup } from "react-bootstrap";

const ContactList = ({ contacts, onSelectContact }) => {
  return (
    <ListGroup>
      {contacts.map((contact) => (
        <ListGroup.Item
          key={contact.id}
          action
          onClick={() => onSelectContact(contact)}
        >
          {contact.email}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ContactList;
