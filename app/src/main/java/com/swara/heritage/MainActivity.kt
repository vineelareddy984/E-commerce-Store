package com.swara.heritage

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.coil.compose.AsyncImage
import com.swara.heritage.ui.theme.*

data class CartItem(
    val product: Product,
    var quantity: Int,
    val selectedColor: ColorSelection,
    val selectedSize: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SwaraHeritageTheme {
                MainLayout()
            }
        }
    }
}

// Utility to parse color hex strings safely
fun parseColor(hex: String): Color {
    return try {
        Color(android.graphics.Color.parseColor(hex))
    } catch (e: Exception) {
        Color.Gray
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainLayout() {
    val context = LocalContext.current
    var currentView by remember { mutableStateOf("home") } // "home", "products", "detail", "cart"
    var selectedProductId by remember { mutableStateOf<String?>(null) }
    
    // Core states
    val products = remember { SwaraData.products }
    val categories = remember { SwaraData.categories }
    val wishlist = remember { mutableStateOf(setOf<String>()) }
    val cartItems = remember { mutableStateListOf<CartItem>() }
    
    var selectedCategoryFilter by remember { mutableStateOf("all") }
    
    // Wishlist Toggle
    val toggleWishlist: (String) -> Unit = { id ->
        if (wishlist.value.contains(id)) {
            wishlist.value = wishlist.value - id
            Toast.makeText(context, "Removed from Favorites Portfolio", Toast.LENGTH_SHORT).show()
        } else {
            wishlist.value = wishlist.value + id
            Toast.makeText(context, "Adorned in Favorites Portfolio", Toast.LENGTH_SHORT).show()
        }
    }

    Scaffold(
        topBar = {
            HeaderBar(
                currentView = currentView,
                cartCount = cartItems.sumOf { it.quantity },
                onNavigate = { view ->
                    currentView = view
                }
            )
        },
        bottomBar = {
            FooterSection(
                onNavigate = { view ->
                    currentView = view
                }
            )
        },
        containerColor = SandalwoodCream
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentView) {
                "home" -> HomeView(
                    categories = categories,
                    products = products,
                    wishlist = wishlist.value,
                    onToggleWishlist = toggleWishlist,
                    onNavigateToView = { view -> currentView = view },
                    onSelectCategory = { catId ->
                        selectedCategoryFilter = catId
                        currentView = "products"
                    },
                    onSelectProduct = { prodId ->
                        selectedProductId = prodId
                        currentView = "detail"
                    }
                )
                "products" -> ProductListView(
                    products = products,
                    categories = categories,
                    wishlist = wishlist.value,
                    onToggleWishlist = toggleWishlist,
                    selectedCategoryFilter = selectedCategoryFilter,
                    onChangeCategoryFilter = { selectedCategoryFilter = it },
                    onSelectProduct = { prodId ->
                        selectedProductId = prodId
                        currentView = "detail"
                    }
                )
                "detail" -> {
                    val product = products.find { it.id == selectedProductId }
                    if (product != null) {
                        ProductDetailView(
                            product = product,
                            wishlist = wishlist.value,
                            onToggleWishlist = toggleWishlist,
                            onBackToVault = { currentView = "products" },
                            onAddToCart = { item ->
                                cartItems.add(item)
                                Toast.makeText(context, "Added ${product.name} to Consignment", Toast.LENGTH_SHORT).show()
                                currentView = "cart"
                            }
                        )
                    } else {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("Product not found.", color = CharcoalStone)
                        }
                    }
                }
                "cart" -> CartView(
                    cartItems = cartItems,
                    onRemoveItem = { cartItems.remove(it) },
                    onBackToVault = { currentView = "products" },
                    onClearCart = { cartItems.clear() }
                )
            }
        }
    }
}

@Composable
fun HeaderBar(
    currentView: String,
    cartCount: Int,
    onNavigate: (String) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = SandalwoodCream,
        border = BorderStroke(width = 0.5.dp, color = WarmBrass.copy(alpha = 0.3f))
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Logo
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onNavigate("home") }
                ) {
                    Text(
                        text = "SWARA",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = CharcoalStone,
                        fontStyle = FontStyle.Normal,
                        letterSpacing = 4.sp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .background(RoyalEmerald.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                            .border(1.dp, WarmBrass.copy(alpha = 0.25f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "HERITAGE",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = WarmBrass,
                            letterSpacing = 1.sp
                        )
                    }
                }

                // Header Navigation Items
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { onNavigate("home") }) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Home",
                            tint = if (currentView == "home") RoyalEmerald else CharcoalStone
                        )
                    }
                    IconButton(onClick = { onNavigate("products") }) {
                        Icon(
                            imageVector = Icons.Default.GridOn,
                            contentDescription = "Vault",
                            tint = if (currentView == "products") RoyalEmerald else CharcoalStone
                        )
                    }
                    Box {
                        IconButton(onClick = { onNavigate("cart") }) {
                            Icon(
                                imageVector = Icons.Default.ShoppingCart,
                                contentDescription = "Consignment List",
                                tint = if (currentView == "cart") RoyalEmerald else CharcoalStone
                            )
                        }
                        if (cartCount > 0) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .background(CrimsonRich, CircleShape)
                                    .size(16.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = cartCount.toString(),
                                    color = Color.White,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HomeView(
    categories: List<Category>,
    products: List<Product>,
    wishlist: Set<String>,
    onToggleWishlist: (String) -> Unit,
    onNavigateToView: (String) -> Unit,
    onSelectCategory: (String) -> Unit,
    onSelectProduct: (String) -> Unit
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .background(SandalwoodCream)
    ) {
        // 1. Decorative Mandap Heroscreen Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF6F3EC))
                .padding(vertical = 32.dp, horizontal = 20.dp)
        ) {
            // Background Ornate Ring Graphic
            Canvas(modifier = Modifier.fillMaxSize().align(Alignment.Center)) {
                drawCircle(
                    color = WarmBrass.copy(alpha = 0.1f),
                    radius = size.width / 3f,
                    style = Stroke(width = 1.dp.toPx())
                )
            }

            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "ROYAL INDIAN HERITAGE ATELIER",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = WarmBrass,
                    letterSpacing = 3.sp,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Sovereign Artistry",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Medium,
                    color = CharcoalStone,
                    fontStyle = FontStyle.Normal,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "for Contemporary Rooms",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Light,
                    color = CrimsonRich,
                    fontStyle = FontStyle.Italic,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Delve into centuries of timeless grand craftsmanship. Adorn your space with pure mountain-seasoned Kashmiri Walnut, traditional lost-wax Aligarh brassware, and gorgeous Varanasi hand-spun silks.",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Light,
                    color = CharcoalStone.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(24.dp))
                
                Button(
                    onClick = { onNavigateToView("products") },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalEmerald),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.wrapContentSize()
                ) {
                    Text(
                        text = "EXPLORE TREASURES",
                        letterSpacing = 1.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 11.sp
                    )
                }
            }
        }

        // 2. Featured Category portals
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 24.dp)) {
            Text(
                text = "SHOP BY HERITAGE SUITE",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MutedText,
                letterSpacing = 2.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Box(
                modifier = Modifier
                    .width(40.dp)
                    .height(2.dp)
                    .background(WarmBrass)
            )
            Spacer(modifier = Modifier.height(16.dp))

            // Horizontally Scroll Category Suite Portals
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(categories) { cat ->
                    Card(
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .width(280.dp)
                            .height(200.dp)
                            .clickable { onSelectCategory(cat.id) },
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxSize()) {
                            AsyncImage(
                                model = cat.image,
                                contentDescription = cat.name,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(120.dp),
                                contentScale = ContentScale.Crop
                            )
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = cat.name,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = CharcoalStone
                                    )
                                    Text(
                                        text = "${cat.count} Items",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = WarmBrass
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = cat.description,
                                    fontSize = 11.sp,
                                    color = MutedText,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis,
                                    lineHeight = 14.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // 3. Manifesto Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp, horizontal = 16.dp)
                .background(Color(0xFFFCFAF6), RoundedCornerShape(8.dp))
                .border(0.5.dp, WarmBrass.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                .padding(24.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "THE SWARA MANIFESTO",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = WarmBrass,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "\"We believe true luxury is a sacred union of ancestry, spirit, and dedicated raw handwork. Our pieces represent an unyielding rejection of sterile mass automation.\"",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Normal,
                    fontStyle = FontStyle.Italic,
                    color = CharcoalStone,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "SWARA HERITAGE BOARD",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    color = RoyalEmerald,
                    letterSpacing = 1.sp
                )
            }
        }

        // 4. Highly Coveted Treasures
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 24.dp)) {
            Text(
                text = "MOST COVETED SIGNATURES",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MutedText,
                letterSpacing = 2.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Box(
                modifier = Modifier
                    .width(40.dp)
                    .height(2.dp)
                    .background(WarmBrass)
            )
            Spacer(modifier = Modifier.height(16.dp))

            products.forEach { p ->
                Card(
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable { onSelectProduct(p.id) },
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = p.images.firstOrNull(),
                            contentDescription = p.name,
                            modifier = Modifier
                                .size(90.dp)
                                .clip(RoundedCornerShape(6.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = p.name,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = CharcoalStone
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = p.tagline,
                                fontSize = 11.sp,
                                fontStyle = FontStyle.Italic,
                                color = MutedText,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Rating",
                                    tint = WarmBrass,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                                Text(
                                    text = "${p.rating} (${p.numReviews})",
                                    fontSize = 10.sp,
                                    color = CharcoalStone
                                )
                            }
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "$${p.price}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalEmerald
                            )
                            IconButton(onClick = { onToggleWishlist(p.id) }) {
                                Icon(
                                    imageVector = if (wishlist.contains(p.id)) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                    contentDescription = "Wishlist",
                                    tint = if (wishlist.contains(p.id)) CrimsonRich else CharcoalStone.copy(alpha = 0.5f)
                                )
                            }
                        }
                    }
                }
            }
        }

        // 5. High-Conversion Checkout Keys (Promo Card Copying)
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 24.dp)
                .background(CharcoalStone, RoundedCornerShape(12.dp))
                .padding(20.dp)
        ) {
            Text(
                text = "LIMITED COLLECTION OFFERS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = WarmBrass,
                letterSpacing = 1.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Verified Checkout Keys",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "Enter these codes at checkout registry to apply your sovereign values discount.",
                fontSize = 11.sp,
                color = Color.White.copy(alpha = 0.7f),
                lineHeight = 14.sp
            )
            Spacer(modifier = Modifier.height(16.dp))

            val coupons = listOf(
                Pair("UTSAV50", "50% off heritage accents"),
                Pair("SHAADI20", "20% off luxury weaves"),
                Pair("SWARA10", "10% off general orders")
            )

            coupons.forEach { coupon ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .background(Color.White.copy(alpha = 0.08f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = coupon.first,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = WarmBrass,
                            fontSize = 14.sp
                        )
                        Text(
                            text = coupon.second,
                            fontSize = 10.sp,
                            color = Color.White.copy(alpha = 0.6f)
                        )
                    }

                    Button(
                        onClick = {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            val clip = ClipData.newPlainText("promo_code", coupon.first)
                            clipboard.setPrimaryClip(clip)
                            Toast.makeText(context, "${coupon.first} Copied to Registry!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = WarmBrass),
                        shape = RoundedCornerShape(4.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text("Copy", fontSize = 10.sp, color = CharcoalStone, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun ProductListView(
    products: List<Product>,
    categories: List<Category>,
    wishlist: Set<String>,
    onToggleWishlist: (String) -> Unit,
    selectedCategoryFilter: String,
    onChangeCategoryFilter: (String) -> Unit,
    onSelectProduct: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var maxPrice by remember { mutableStateOf(2000f) }
    var sortBy by remember { mutableStateOf("featured") } // "featured", "price_low", "price_high"
    
    // Filter Products
    val filteredProducts = products.filter { product ->
        val matchesCategory = selectedCategoryFilter == "all" || product.category == selectedCategoryFilter
        val matchesSearch = product.name.contains(searchQuery, ignoreCase = true) || 
                            product.tagline.contains(searchQuery, ignoreCase = true) ||
                            product.description.contains(searchQuery, ignoreCase = true)
        val matchesPrice = product.price <= maxPrice.toInt()
        
        matchesCategory && matchesSearch && matchesPrice
    }.sortedWith(Comparator { p1, p2 ->
        when (sortBy) {
            "price_low" -> p1.price.compareTo(p2.price)
            "price_high" -> p2.price.compareTo(p1.price)
            else -> p2.featured.compareTo(p1.featured) // featured first
        }
    })

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SandalwoodCream)
            .padding(16.dp)
    ) {
        // Headers
        Text(
            text = "HERITAGE VAULT",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = CharcoalStone,
            letterSpacing = 2.sp
        )
        Text(
            text = "Sifting ${filteredProducts.size} of ${products.size} sovereign creations",
            fontSize = 11.sp,
            color = WarmBrass,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(14.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search the treasury...", color = MutedText) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = RoyalEmerald,
                unfocusedBorderColor = WarmBrass.copy(alpha = 0.4f),
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White
            ),
            shape = RoundedCornerShape(8.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Category Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val filters = listOf(
                Pair("all", "All Vaults"),
                Pair("furniture", "Furniture & Teak"),
                Pair("apparel", "Apparel & Handloom"),
                Pair("objects", "Ritual Objects")
            )
            
            filters.forEach { filter ->
                val isSelected = selectedCategoryFilter == filter.first
                Box(
                    modifier = Modifier
                        .background(
                            if (isSelected) RoyalEmerald else Color.White,
                            RoundedCornerShape(20.dp)
                        )
                        .border(
                            1.dp,
                            if (isSelected) Color.Transparent else WarmBrass.copy(alpha = 0.3f),
                            RoundedCornerShape(20.dp)
                        )
                        .clickable { onChangeCategoryFilter(filter.first) }
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = filter.second,
                        color = if (isSelected) Color.White else CharcoalStone,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(12.dp))

        // Sorting & Sliders Row
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(8.dp))
                .border(0.5.dp, WarmBrass.copy(alpha = 0.25f), RoundedCornerShape(8.dp))
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Price Cap: $${maxPrice.toInt()}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = RoyalEmerald)
                Text("Sort by:", fontSize = 11.sp, color = CharcoalStone)
            }
            Slider(
                value = maxPrice,
                onValueChange = { maxPrice = it },
                valueRange = 40f..2000f,
                colors = SliderDefaults.colors(
                    thumbColor = RoyalEmerald,
                    activeTrackColor = RoyalEmerald,
                    inactiveTrackColor = Color.LightGray
                )
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                listOf(
                    Pair("featured", "Sovereign First"),
                    Pair("price_low", "Price Low-High"),
                    Pair("price_high", "Price High-Low")
                ).forEach { sortOption ->
                    val isSorted = sortBy == sortOption.first
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(
                                if (isSorted) WarmBrass.copy(alpha = 0.15f) else Color.Transparent,
                                RoundedCornerShape(4.dp)
                            )
                            .border(
                                0.5.dp,
                                if (isSorted) WarmBrass else Color.LightGray.copy(alpha = 0.5f),
                                RoundedCornerShape(4.dp)
                            )
                            .clickable { sortBy = sortOption.first }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(sortOption.second, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = CharcoalStone)
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(14.dp))

        // Products List Grid
        if (filteredProducts.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Text("No matching Indian masterpieces found.", color = MutedText, textAlign = TextAlign.Center)
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredProducts) { p ->
                    Card(
                        shape = RoundedCornerShape(8.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectProduct(p.id) }
                    ) {
                        Column {
                            Box(modifier = Modifier.fillMaxWidth().height(130.dp)) {
                                AsyncImage(
                                    model = p.images.firstOrNull(),
                                    contentDescription = p.name,
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(6.dp)
                                        .background(Color.White.copy(alpha = 0.9f), CircleShape)
                                        .size(28.dp)
                                        .clickable { onToggleWishlist(p.id) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (wishlist.contains(p.id)) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                        contentDescription = "Wishlist",
                                        tint = if (wishlist.contains(p.id)) CrimsonRich else CharcoalStone.copy(alpha = 0.5f),
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                            
                            Column(modifier = Modifier.padding(8.dp)) {
                                Text(
                                    text = p.name,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CharcoalStone,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = p.tagline,
                                    fontSize = 10.sp,
                                    fontStyle = FontStyle.Italic,
                                    color = MutedText,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "$${p.price}",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = RoyalEmerald
                                    )
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Star,
                                            contentDescription = "Star",
                                            tint = WarmBrass,
                                            modifier = Modifier.size(12.dp)
                                        )
                                        Spacer(modifier = Modifier.width(2.dp))
                                        Text(p.rating.toString(), fontSize = 10.sp, color = CharcoalStone)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProductDetailView(
    product: Product,
    wishlist: Set<String>,
    onToggleWishlist: (String) -> Unit,
    onBackToVault: () -> Unit,
    onAddToCart: (CartItem) -> Unit
) {
    val scrollState = rememberScrollState()
    var selectedImageIndex by remember { mutableStateOf(0) }
    var selectedColor by remember { mutableStateOf(product.colors.first()) }
    var selectedSize by remember { mutableStateOf(product.sizes.first()) }
    var detailTab by remember { mutableStateOf("specs") } // "specs", "provenance"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .background(SandalwoodCream)
            .padding(16.dp)
    ) {
        // Back Navigation
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onBackToVault() }
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CharcoalStone)
            Spacer(modifier = Modifier.width(6.dp))
            Text("Back to Treasury Vault", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CharcoalStone)
        }
        Spacer(modifier = Modifier.height(12.dp))

        // Image Gallery Display
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .clip(RoundedCornerShape(8.dp))
                .border(0.5.dp, WarmBrass.copy(alpha = 0.25f), RoundedCornerShape(8.dp))
        ) {
            AsyncImage(
                model = product.images.getOrElse(selectedImageIndex) { product.images.first() },
                contentDescription = product.name,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            // Wishlist Heart Overlay
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .background(Color.White, CircleShape)
                    .size(36.dp)
                    .clickable { onToggleWishlist(product.id) },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (wishlist.contains(product.id)) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = if (wishlist.contains(product.id)) CrimsonRich else CharcoalStone.copy(alpha = 0.5f)
                )
            }
        }

        // Sub Image Selectors row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            product.images.forEachIndexed { idx, imgUrl ->
                Card(
                    modifier = Modifier
                        .size(60.dp)
                        .clickable { selectedImageIndex = idx }
                        .border(
                            2.dp,
                            if (selectedImageIndex == idx) RoyalEmerald else Color.Transparent,
                            RoundedCornerShape(6.dp)
                        ),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    AsyncImage(model = imgUrl, contentDescription = null, contentScale = ContentScale.Crop)
                }
            }
        }
        Spacer(modifier = Modifier.height(12.dp))

        // Specs & Descriptions
        Text(
            text = product.name,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = CharcoalStone
        )
        Text(
            text = product.tagline,
            fontSize = 12.sp,
            fontStyle = FontStyle.Italic,
            color = CrimsonRich,
            modifier = Modifier.padding(vertical = 2.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$${product.price}",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = RoyalEmerald
            )
            
            Box(
                modifier = Modifier
                    .background(WarmBrass.copy(alpha = 0.12f), RoundedCornerShape(4.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (product.stock > 0) "Sovereign Registry Avail: ${product.stock}" else "Sold Out",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = WarmBrass
                )
            }
        }
        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = product.description,
            fontSize = 12.sp,
            color = CharcoalStone.copy(alpha = 0.85f),
            lineHeight = 18.sp
        )
        Spacer(modifier = Modifier.height(16.dp))

        // Interactive Dot color choices
        Text("SELECT HERITAGE SHADE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MutedText, letterSpacing = 1.sp)
        Row(
            modifier = Modifier.padding(vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            product.colors.forEach { c ->
                val isSelected = selectedColor == c
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(parseColor(c.hex))
                        .border(
                            2.dp,
                            if (isSelected) CharcoalStone else Color.Transparent,
                            CircleShape
                        )
                        .clickable { selectedColor = c }
                )
            }
        }
        Text(selectedColor.name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = CharcoalStone)
        Spacer(modifier = Modifier.height(14.dp))

        // Sizes selector
        Text("SELECT DIMENSIONS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MutedText, letterSpacing = 1.sp)
        Row(
            modifier = Modifier.padding(vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            product.sizes.forEach { sz ->
                val isSelected = selectedSize == sz
                Box(
                    modifier = Modifier
                        .background(if (isSelected) RoyalEmerald else Color.White, RoundedCornerShape(4.dp))
                        .border(1.dp, if (isSelected) Color.Transparent else Color.LightGray, RoundedCornerShape(4.dp))
                        .clickable { selectedSize = sz }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(sz, color = if (isSelected) Color.White else CharcoalStone, fontSize = 11.sp)
                }
            }
        }
        Spacer(modifier = Modifier.height(18.dp))

        // Consignment Button
        Button(
            onClick = {
                onAddToCart(
                    CartItem(
                        product = product,
                        quantity = 1,
                        selectedColor = selectedColor,
                        selectedSize = selectedSize
                    )
                )
            },
            colors = ButtonDefaults.buttonColors(containerColor = RoyalEmerald),
            shape = RoundedCornerShape(4.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                "ADD TO CONSIGNMENT PORTFOLIO",
                letterSpacing = 1.5.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.height(24.dp))

        // Expandable specifications tab
        Row(modifier = Modifier.fillMaxWidth()) {
            listOf(
                Pair("specs", "Treasury Details"),
                Pair("provenance", "Ancestral Lore Story")
            ).forEach { tab ->
                val isSelected = detailTab == tab.first
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { detailTab = tab.first }
                        .drawBehind {
                            if (isSelected) {
                                drawLine(
                                    color = RoyalEmerald,
                                    start = androidx.compose.ui.geometry.Offset(0f, size.height),
                                    end = androidx.compose.ui.geometry.Offset(size.width, size.height),
                                    strokeWidth = 3.dp.toPx()
                                )
                            }
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = tab.second,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) RoyalEmerald else CharcoalStone
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(12.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(6.dp))
                .border(0.5.dp, WarmBrass.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                .padding(14.dp)
        ) {
            if (detailTab == "specs") {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    product.details.forEach { d ->
                        Row {
                            Text("• ", color = WarmBrass, fontWeight = FontWeight.Bold)
                            Text(d, fontSize = 11.sp, color = CharcoalStone.copy(alpha = 0.8f))
                        }
                    }
                }
            } else {
                Text(
                    text = "Our workshop collaborates directly with indigenous family-owned woodworking guilds, local copper beaters, and fair-trade handloom weavers across Srinagar, Aligarh, Saharanpur, and Rajasthan. We select fine, aged regional timber and hand-spun materials that retain natural organic checking, checks, and unique weave nodes, ensuring every Swara creation represents a sacred, completely unique portrait of Indian soil, time-tested heritage, and authentic geography.",
                    fontSize = 11.sp,
                    color = CharcoalStone.copy(alpha = 0.85f),
                    lineHeight = 16.sp
                )
            }
        }
        Spacer(modifier = Modifier.height(24.dp))

        // Reviews section
        if (product.reviews.isNotEmpty()) {
            Text("PATRONS ESSAYS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MutedText, letterSpacing = 1.5.sp)
            Spacer(modifier = Modifier.height(8.dp))
            product.reviews.forEach { rev ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(rev.userName, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = CharcoalStone)
                            Text(rev.date, fontSize = 10.sp, color = MutedText)
                        }
                        Row(modifier = Modifier.padding(vertical = 2.dp)) {
                            repeat(rev.rating) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = WarmBrass, modifier = Modifier.size(12.dp))
                            }
                        }
                        Text(rev.comment, fontSize = 11.sp, color = CharcoalStone, lineHeight = 15.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun CartView(
    cartItems: List<CartItem>,
    onRemoveItem: (CartItem) -> Unit,
    onBackToVault: () -> Unit,
    onClearCart: () -> Unit
) {
    val scrollState = rememberScrollState()
    
    // Form fields
    var patronName by remember { mutableStateOf("") }
    var patronEmail by remember { mutableStateOf("") }
    var deliverySanctuary by remember { mutableStateOf("") }
    var promoCodeInput by remember { mutableStateOf("") }
    
    var appliedPromo by remember { mutableStateOf<String?>(null) }
    var discountValue by remember { mutableStateOf(0f) }
    var orderSubmitted by remember { mutableStateOf(false) }

    val cleanTotal = cartItems.sumOf { it.product.price * it.quantity }
    val discountCost = (cleanTotal * discountValue).toInt()
    val ultimateTotal = cleanTotal - discountCost

    if (orderSubmitted) {
        // Success state screen
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .background(SandalwoodCream)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .background(Color.White, CircleShape)
                    .border(2.dp, WarmBrass, CircleShape)
                    .size(72.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Success",
                    tint = RoyalEmerald,
                    modifier = Modifier.size(36.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                "CONSIGNMENT CAPTURED",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = CharcoalStone,
                letterSpacing = 2.sp
            )
            Text(
                "Swara Heritage Registry",
                fontSize = 14.sp,
                fontStyle = FontStyle.Italic,
                color = CrimsonRich
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Thank you beloved patron $patronName. Your sanctuary request has been captured in our imperial records under Registry Ref #${(100000..999999).random()}.\n\nOur traditional logistics team will dispatch tracking records inside Srinagar shortly.",
                fontSize = 12.sp,
                color = CharcoalStone,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    onClearCart()
                    onBackToVault()
                },
                colors = ButtonDefaults.buttonColors(containerColor = RoyalEmerald),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text("Return to Treasury", letterSpacing = 1.sp, color = Color.White)
            }
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .background(SandalwoodCream)
            .padding(16.dp)
    ) {
        Text(
            text = "CONSIGNMENT REGISTRY",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = CharcoalStone,
            letterSpacing = 1.5.sp
        )
        Spacer(modifier = Modifier.height(14.dp))

        if (cartItems.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 40.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Your consignment portfolio is currently empty.", color = MutedText, textAlign = TextAlign.Center)
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { onBackToVault() },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalEmerald),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text("Assemble Suite", color = Color.White)
                }
            }
        } else {
            // Display Cart items
            cartItems.forEach { item ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = item.product.images.firstOrNull(),
                            contentDescription = item.product.name,
                            modifier = Modifier
                                .size(70.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.product.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = CharcoalStone)
                            Text(
                                "Shade: ${item.selectedColor.name} | Size: ${item.selectedSize}",
                                fontSize = 10.sp,
                                color = MutedText
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("$${item.product.price}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RoyalEmerald)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    IconButton(
                                        onClick = {
                                            if (item.quantity > 1) {
                                                item.quantity--
                                            } else {
                                                onRemoveItem(item)
                                            }
                                        },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Icon(Icons.Default.Remove, contentDescription = "Decrease", modifier = Modifier.size(16.dp))
                                    }
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(item.quantity.toString(), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    IconButton(
                                        onClick = { item.quantity++ },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = "Increase", modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))

            // Promotions Form Drawer
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = promoCodeInput,
                    onValueChange = { promoCodeInput = it },
                    placeholder = { Text("Checkout coupon (e.g. UTSAV50)") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                        focusedBorderColor = RoyalEmerald
                    ),
                    shape = RoundedCornerShape(4.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = {
                        val trimmed = promoCodeInput.trim().uppercase()
                        if (trimmed == "UTSAV50") {
                            appliedPromo = "UTSAV50"
                            discountValue = 0.50f
                        } else if (trimmed == "SHAADI20") {
                            appliedPromo = "SHAADI20"
                            discountValue = 0.20f
                        } else if (trimmed == "SWARA10") {
                            appliedPromo = "SWARA10"
                            discountValue = 0.10f
                        } else {
                            Toast.makeText(context, "Invalid key", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = WarmBrass),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text("Apply", color = CharcoalStone, fontWeight = FontWeight.Bold)
                }
            }
            
            if (appliedPromo != null) {
                Text(
                    text = "Consignment key $appliedPromo actively registered! Saved ${(discountValue * 100).toInt()}% off.",
                    color = Color(0xFF007A3E),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))

            // Total details pane
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White, RoundedCornerShape(6.dp))
                    .border(0.5.dp, WarmBrass.copy(alpha = 0.25f), RoundedCornerShape(6.dp))
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Consignment Subtotal", fontSize = 11.sp, color = MutedText)
                    Text("$${cleanTotal}", fontSize = 11.sp, color = CharcoalStone)
                }
                if (appliedPromo != null) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Active Code Registry (${appliedPromo})", fontSize = 11.sp, color = MutedText)
                        Text("-$${discountCost}", fontSize = 11.sp, color = CrimsonRich)
                    }
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Treasury Packing & Delivery", fontSize = 11.sp, color = MutedText)
                    Text("Gratis Compassion", fontSize = 11.sp, color = WarmBrass, fontWeight = FontWeight.Bold)
                }
                Divider(modifier = Modifier.padding(vertical = 4.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Ultimate Sovereign Total", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CharcoalStone)
                    Text("$${ultimateTotal}", fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, color = RoyalEmerald)
                }
            }
            Spacer(modifier = Modifier.height(20.dp))

            // Checkout Form
            Text("PATRON DELIVERY REGISTRY", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MutedText, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(8.dp))
            
            OutlinedTextField(
                value = patronName,
                onValueChange = { patronName = it },
                label = { Text("Patron Name") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White, unfocusedContainerColor = Color.White, focusedBorderColor = RoyalEmerald)
            )
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = patronEmail,
                onValueChange = { patronEmail = it },
                label = { Text("E-Mail Dispatch") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White, unfocusedContainerColor = Color.White, focusedBorderColor = RoyalEmerald)
            )
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = deliverySanctuary,
                onValueChange = { deliverySanctuary = it },
                label = { Text("Sanctuary Delivery Address") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = Color.White, unfocusedContainerColor = Color.White, focusedBorderColor = RoyalEmerald)
            )
            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (patronName.isBlank() || patronEmail.isBlank() || deliverySanctuary.isBlank()) {
                        Toast.makeText(context, "Beloved Patron, please specify all sanctuary dispatch parameters.", Toast.LENGTH_SHORT).show()
                    } else {
                        orderSubmitted = true
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = CrimsonRich),
                shape = RoundedCornerShape(4.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("SUBMIT SOVEREIGN REGISTRY CONSIGNMENT", letterSpacing = 1.sp, color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun FooterSection(
    onNavigate: (String) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = CharcoalStone,
        border = BorderStroke(width = 0.5.dp, color = WarmBrass.copy(alpha = 0.2f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "SWARA HERITAGE",
                color = Color.White,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp
            )
            Text(
                "Srinagar • Varanasi • Aligarh • Rajasthan",
                color = WarmBrass,
                fontSize = 9.sp,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 2.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Curating royal Indian artistry for sovereign sanctuaries.",
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 9.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "© 2026 Swara Heritage Inc. Co-crafted lovingly with Indian artisans.",
                color = Color.White.copy(alpha = 0.4f),
                fontSize = 8.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}
