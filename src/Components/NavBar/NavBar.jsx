import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import logoUrl from "../../assets/football-logo.svg";
import styles from "./NavBar.module.css";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      navigate(`/playerDetails/${99}`, { state: { name: searchValue } });
    }
  };

  const handleReturnHome = () => {
    navigate(`/home`);
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters className={styles.toolbar}>
          {/* LEFT: logo + title */}
          <Box className={styles.brand}>
            <img src={logoUrl} alt="football logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              // href="#app-bar-with-responsive-menu"
              className={styles.titleDesktop}
              onClick={handleReturnHome}
            >
              Footy Scouter
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              className={styles.titleMobile}
            >
              Footy Scouter
            </Typography>
          </Box>

          {/* CENTER: search box + tagline */}
          <Box className={styles.centerGroup}>
            <Box className={styles.searchWrap}>
              <TextField
                value={searchValue}
                onChange={handleSearch}
                onKeyDown={handlePressEnter}
                id="player-search"
                variant="outlined"
                size="small"
                placeholder="Search to scout a player"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 0.5 }}>
                      <SearchIcon sx={{ color: "rgba(255,255,255,0.9)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                        }}
                        aria-label="clear search"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "28px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "28px",
                    paddingRight: 0,
                    color: "inherit",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(255,255,255,0.24)",
                    },
                    "& input": {
                      padding: "10px 12px",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                    opacity: 1,
                  },
                }}
                inputProps={{
                  "aria-label": "player search",
                }}
              />
            </Box>

            <Typography className={styles.tagline} aria-hidden="true">
              Numbers That Scout the Beautiful Game
            </Typography>
          </Box>

          {/* RIGHT: mobile menu / future controls */}
          <Box className={styles.rightGroup}>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* placeholder for future right-side items (user avatar, settings) */}
            {/*
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
