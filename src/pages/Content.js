import React, { useEffect, useState } from "react";
import { Button, Card, Container, Navbar, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Diary.css";
import Moment from "react-moment";

function Content() {
  const token = localStorage.getItem("token");
  const [diary, setDiary] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDiary = async () => {
      const response = await axios.get(
        `https://private-amnesiac-c75abc-halfwineaid.apiary-proxy.com/diary?page=${activePage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setDiary(response.data.data);
      setTotalPages(Math.ceil(response.data.total_data / 10));
    };
    fetchDiary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const displayDiary = diary.map((item) => (
    <Link
      to={`/diary/` + item.id}
      className="text-decoration-none text-dark"
      key={item.id}
    >
      <Card>
        <Card.Body className="d-flex justify-content-between">
          <Card.Title>{item.title}</Card.Title>
          <Card.Text className="text-muted">
            <Moment fromNow>{item.updated_at}</Moment>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  ));

  return (
    <>
      <Navbar />
      <div className="min-vh-100">
        <Container
          className="d-flex flex-column gap-3"
          style={{ paddingTop: "5rem" }}
        >
          {displayDiary}
          <Pagination className="my-5" size="lg">
            <Pagination.First
              disabled={activePage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={activePage === 1}
              onClick={() => handlePageChange(activePage - 1)}
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === activePage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={activePage === totalPages}
              onClick={() => handlePageChange(activePage + 1)}
            />
            <Pagination.Last
              disabled={activePage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </Container>
      </div>

      <Link to="/create-diary" className="text-decoration-none text-white">
        <Button
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
            color: "white",
          }}
        >
          +
        </Button>
      </Link>
    </>
  );
}

export default Content;
