import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Row,
  Col,
  Container,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { FaEdit } from "react-icons/fa/index.esm.js";
import $ from "jquery";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [formState, setFormState] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    image: null,
  });
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { loading, data } = useQuery(QUERY_USER);
  const [updateUser, { error }] = useMutation(UPDATE_USER);
  const [imageChanged, setImageChanged] = useState(false);
  const [editor, setEditor] = useState(null);
  // const userData = data?.user || {};
  useEffect(() => {
    if (data) {
      console.log("userData", data.user);
      setUserData(data.user);
      setFormState({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        image: data.user.image,
      });
    }
  }, [data]);
  useEffect(() => {
    if (Auth.loggedIn()) {
      setLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);
  useEffect(() => {
    console.log("formState", formState);
  }, [formState]);

  const handleDrop = (dropped) => {
    console.log("dropped", dropped);
    const file = dropped[0];
    setImagePreview(file);
    const path = `./assets/images/uploads/profile-${userData._id}.jpg`;
    setFormState({
      ...formState,
      image: path,
    });
    setImageChanged(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("formState", formState);
    try {
      if (!formState.password) delete formState.password;
      const { data } = await updateUser({
        variables: { ...formState },
      });
      console.log("data", data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleInputChange = (event) => {
    const { name, value, defaultValue } = event.target;
    const changed = value !== defaultValue;

    setChanged(changed);
    console.log("name", name, "value", value);
    if (changed) {
      setEditing(true);
      if (name.includes("password")) setShowPasswordConfirm(true);
    } else {
      setShowPasswordConfirm(false);
      $('[name="passwordConfirm"]').val("");
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const target = $(e.target);
    const type =
      target.attr("id")?.split("-")[1] ||
      target.parent().attr("id").split("-")[1] ||
      target.attr("id");
    console.log("type", type);
    switch (type) {
      case "icon":
        setEditing(true);
        break;
      case "save":
        setImageChanged(false);
        try {
          console.log("formState", formState);
          if (!formState.password) delete formState.password;

          const { data } = await updateUser({
            variables: { ...formState },
          });
          console.log("data", data);
          const id = userData._id;
          if (editor) {
            const canvas = editor.getImage();
            const img = editor.getImageScaledToCanvas().toDataURL();
            console.log("canvas", canvas, "img", typeof img);
            const newImg = { data: img, contentType: "image/png" };
            axios.post(`image/${id}`, { newImg }).then((res) => {
              console.log("res", res);
            });
          }
        } catch (err) {
          console.error(err);
        }
        break;
      case "cancel":
        setImageChanged(false);
        setImagePreview(null);
        break;
      default:
        break;
    }
  };
  const setEditorRef = (editor) => setEditor(editor);
  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <Dropzone
            onDrop={handleDrop}
            noKeyboard
            noClick={imageChanged}
            style={{ width: "250px", height: "250px" }}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div {...getRootProps()}>
                <AvatarEditor
                  ref={setEditorRef}
                  image={
                    imagePreview ||
                    userData.image ||
                    "https://via.placeholder.com/200"
                  }
                  width={200}
                  height={200}
                  border={0}
                  borderRadius={100}
                  color={[255, 255, 255, 0]} // RGBA
                  scale={1}
                  rotate={0}
                />
                <input {...getInputProps()} name="pic" />
                {isDragActive ? <p>Drop the files here ...</p> : <p></p>}
              </div>
            )}
          </Dropzone>
          <div id="upload-btns" className="" hidden={!imageChanged}>
            <Button
              id="img-save"
              onClick={handleClick}
              className="profile-btn mx-3 btn-success"
            >
              Save
            </Button>
            <Button
              id="img-cancel"
              onClick={handleClick}
              className="profile-btn mx-3 btn-danger"
            >
              Cancel
            </Button>
          </div>
        </Col>
        <Col xs={8} id="profile-info">
          <Form
            id="profile-form"
            className="align-items-start"
            onChange={handleInputChange}
            onSubmit={handleFormSubmit}
          >
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  defaultValue={userData.firstName}
                  name="firstName"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  defaultValue={userData.lastName}
                  name="lastName"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  defaultValue={userData.email}
                  name="email"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3" hidden={!editing}>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3" hidden={!showPasswordConfirm}>
              <Form.Group as={Col} controlId="formGridPasswordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                />
              </Form.Group>
            </Row>
            <Button
              className="me-3"
              variant="success"
              type="submit"
              hidden={!changed}
              disabled={!changed}
            >
              Submit
            </Button>
            <Button
              variant="danger"
              type="reset"
              disabled={!changed}
              hidden={!changed}
            >
              Cancel
            </Button>
          </Form>
        </Col>
        <Col id="col-icon" hidden={!loggedIn} onClick={handleClick}>
          <FaEdit id="edit-icon" />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
