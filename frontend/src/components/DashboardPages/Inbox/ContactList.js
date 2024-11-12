// ContactList.js
import React from "react";
import { ListGroup } from "react-bootstrap";

const ContactList = ({ contacts, onSelectContact }) => {
  console.log(contacts, "contacts");
  return (
    <ListGroup>
      {contacts &&
        contacts.map((contact, index) => (
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
