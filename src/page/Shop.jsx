import React, { useEffect, useState } from "react";
import { alpha, Divider, listClasses, ListItemAvatar, ListItemButton, styled } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  fetchProducts,
  incrementItem,
  decrementItem,
  removeFromCart
} from "../reducer/cartSlice";
import {
  Drawer,
  List,
  ListItemText,
  Badge,
  Avatar
} from "@mui/material";
import { selectTotalPrice } from "../reducer/cartSlice";
import {
  Box,
  Grid,
  Paper,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputBase
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import { setCategory } from "../reducer/cartSlice";
import SearchIcon from "@mui/icons-material/Search";
import { ShoppingCart } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto"
  }
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch"
      }
    }
  }
}));

// Main Shop Component
const Shop = () => {
  const dispatch = useDispatch();
  const { products, status, error, cart } = useSelector((state) => state.cart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [seletedCategory, setSelectedCategory] = useState("");
  const totalPrice = useSelector(selectTotalPrice);
  const totalItemsInCart = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch,status ]);

  const handleAddToCart = (product) => {
    // console.log("product to be added :" , product);
    
    if (product.stock <= 0 )
      {
      alert ("This product is out of stock!");
      return ;
    }
    
    dispatch(addToCart(product));
    console.log("product to be cart :" , product);
  };

  const handleRemoveFromCrart = (id) => {
    dispatch(removeFromCart(id));
  };
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setMenuOpen (false);
  };
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (seletedCategory === "" || product.category === seletedCategory) 
  );

  if (status === "loading" || status === "failed") {
    return (<Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      {status === "loading" ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
         
        </>
      )}
    </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}> 
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          <IconButton  onClick={() => handleCategorySelection("")}>
          MUI SHOP
            </IconButton>
    
          </Typography>

          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={totalItemsInCart} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (<Button size ="small" color="secondary" onClick={() => setSearchQuery("")}>clear</Button>)}
          </Search>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250, p:2}} role="presentation">
          <Typography variant="h6" sx={{ p: 2 }}>
            Categories
          </Typography>
          <ListItemButton onClick={() => handleCategorySelection("")}>
              All Categoris
            </ListItemButton>
            
          <List>
            {[...new Set(products.map((product) => product.category))].map(
              (category) => (
                <ListItemButton
                  key={category}
                  onClick={() => {
                   handleCategorySelection(category)}
                  }
                  
                >
                  {category}
                </ListItemButton>
              )
            )}
            
          </List>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 450 , p: 2}}>
          <Typography variant="h5" sx ={{ mb :2}}>MY CART</Typography>
          <Divider sx={{mb : 2}}/>
          <List>
            {cart.map((item) => (
              <Card key={item.id} sx={{mb : 2}}>
              <Box sx={{ display: "flex", alignItems: "center" ,p:2}}>
                
                  <Avatar
                    src={item.thumbnail}
                    alt={item.title}
                    variant="square"
                    sx={{width: 60, height:60, mr: 2}}
                  />
                <ListItemText
                  primary={item.title}
                  secondary={` Price: $${item.price}`}
                  sx={{ flex: 1 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => dispatch(decrementItem(item.id))}
                  >
                    -
                  </Button>
                  <Typography>{item.quantity} </Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => dispatch(incrementItem(item.id))}
                    
                  >
                    +
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFromCrart(item.id)}
                  >
                    X
                  </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </List>
          {cart.length === 0 ? (
            <Typography variant="h5" color="text.secondary" sx={{textAlign :"center",mt : 4}}> Don't have product in cart</Typography>
          ) : (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredProducts.map((product) => (
          <Grid item xs={6} sm={2} md={3} key={product.id}>
            <Item>
              <Card sx={{ maxWidth: "100%" }}>
                <CardMedia
                  component="img"
                  alt={product.title}
                  height="auto"
                  image={product.thumbnail}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography> */}

                  <Typography variant="body1" color="primary">
                    ${product.price}
                  </Typography>

                  <Typography variant="body2" color={product.stock > 0 ? "text.secondary" : "error"}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock" }
                  </Typography>
                </CardContent>
                <CardActions>

                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disbled ={product.stock <= 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    {cart.find((item) => item.id === product.id)?.quantity >= product.stock ? " Out of Stock" : "Add to Cart"}
                 
                 </Button>
                </CardActions>
              </Card>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Shop;
