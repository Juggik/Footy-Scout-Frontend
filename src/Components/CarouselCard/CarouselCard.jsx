// CarouselCard.jsx
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function CarouselCard({
  src,
  alt,
  onLoad,
  name,
  nationality,
  club,
  foot,
  emoji,
  // optional prop to enable hover-only shimmer
  hoverShimmer = false,
}
  
) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/playerDetails/99`, { state: { name: name } });
  }
  return (
    <Card
      className={`ut-card ${hoverShimmer ? "ut-card--hover" : ""}`}
      sx={{ maxWidth: 345 }}
    >
      <CardMedia component="img" alt={alt} onLoad={onLoad} height="200" image={src} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Player Club: {club} <br />
          Player Nationality: <img src={emoji} alt="Emoji flag " height="10" /> {nationality} <br />
          Player foot: {foot}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClick} >Click to find out more</Button>
      </CardActions>
    </Card>
  );
}
