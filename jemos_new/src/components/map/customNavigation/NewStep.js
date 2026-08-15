import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { MdCancel, MdSave } from "react-icons/md";

export const NewStep = (props) => {
  const [distance, setDistance] = useState("");
  const [type, setType] = useState("");
  const [coord, setCoord] = useState({ lat: "", lng: "" });

  const handleCoordinationChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCoord((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    const newStep = {
      distance: distance,
      maneuver: type,
      start_location: coord.lat + "," + coord.lng,
      lat: coord.lat,
      lng: coord.lng,
    };
    props.onSave(newStep);
  };

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle étape</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Distance</Form.Label>
            <Form.Control
              type="text"
              placeholder="Distance"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Type de manoeuvre</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              title={type || "Sélectionner une manoeuvre"}
              onSelect={(eventKey) => setType(eventKey)}
            >
              {props.options.map((option) => (
                <Dropdown.Item eventKey={option} key={option}>
                  {option}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>
          <Form.Group>
            <Form.Label>Coordonnées</Form.Label>
            <Form.Control
              type="text"
              placeholder="Latitude"
              value={coord.lat}
              onChange={handleCoordinationChange}
              name="lat"
            />
            <Form.Control
              type="text"
              placeholder="Longitude"
              value={coord.lng}
              onChange={handleCoordinationChange}
              name="lng"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          <MdCancel />
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <MdSave />
          Sauvegarder
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

NewStep.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};
