import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Navbars from "../components/Navbars";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

function DetailDiary() {
  let token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);

  const { diary_id } = useParams();

  let { data: diarys, refetch } = useQuery("detailDiaryCache", async () => {
    const response = await axios.get(
      "https://private-amnesiac-c75abc-halfwineaid.apiary-proxy.com/diary/" +
        diary_id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    refetch();
    return response.data;
  });

  const [title, setTitle] = useState(diarys?.title);
  const [content, setContent] = useState(diarys?.content);

  const handleEditClick = () => {
    setIsEditing(true);
    refetch();
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleArchieve = useMutation(async (e) => {
    try {
      e.preventDefault();

      const archieve = true;

      const response = await axios.put(
        `https://private-amnesiac-c75abc-halfwineaid.apiary-proxy.com/diary/${diary_id}/archieve`,
        archieve,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Successfully", response);
    } catch (error) {
      console.log("Failed", error);
    }
  });

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      const response = await axios.put(
        `https://private-amnesiac-c75abc-halfwineaid.apiary-proxy.com/diary/${diary_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      refetch();
      setIsEditing(false);
      console.log("Successfully", response);
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
  });

  return (
    <>
      <Navbars />
      <div className="min-vh-100">
        <Container
          className="d-flex flex-column gap-3"
          style={{ paddingTop: "5rem" }}
        >
          {isEditing ? (
            <Card className="shadow p-4">
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                  <Form.Control
                    type="text"
                    className="mb-1"
                    value={title}
                    onChange={(e) => setTitle("")}
                  />
                  <Form.Control
                    as="textarea"
                    className="mb-4"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent("")}
                  />
                  <div className="d-flex justify-content-end gap-3">
                    <Button variant="outline-primary" type="submit">
                      Update
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow p-4">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <Card.Title>{diarys?.title}</Card.Title>
                  </div>
                </div>
                <Card.Text className="mb-4">{diarys?.content}</Card.Text>
                <Form.Group className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={handleEditClick}>
                    Edit
                  </Button>
                  <Form onSubmit={(e) => handleArchieve.mutate(e)}>
                    <Button variant="outline-success" type="submit">
                      Archieve
                    </Button>
                  </Form>
                </Form.Group>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
}

export default DetailDiary;
