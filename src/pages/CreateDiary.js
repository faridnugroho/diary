import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbars from "../components/Navbars";
import axios from "axios";

function CreateDiary() {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { title, content };

    try {
      const response = await axios.post(
        "https://private-amnesiac-c75abc-halfwineaid.apiary-proxy.com/diary",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Successfully", response);
      navigate("/");
      setTitle("");
      setContent("");
    } catch (error) {
      if (error.response.status === 401) {
        alert(error.response.data.message);
      } else if (error.response.status === 422) {
        alert(`${error.response.data.message}`);
      } else if (error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Navbars />
      <div className="min-vh-100">
        <Container style={{ paddingTop: "5rem" }}>
          <Card className="p-2">
            <Card.Body>
              <Card.Title className="text-center mb-4">Create Diary</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle("")}
                    className="mb-1"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent("")}
                    className="mb-2"
                  />
                </Form.Group>
                <Form.Group className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" className="w-25">
                    Save
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default CreateDiary;
