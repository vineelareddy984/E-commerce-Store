package com.swara.heritage.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val SandalwoodCream = Color(0xFFFBF9F4)
val RoyalEmerald = Color(0xFF004F53)
val CrimsonRich = Color(0xFF9C2535)
val WarmBrass = Color(0xFFC5A059)
val CharcoalStone = Color(0xFF1C1815)
val PureWhite = Color(0xFFFFFFFF)
val MutedText = Color(0xFF706B62)

private val LightColorScheme = lightColorScheme(
    primary = RoyalEmerald,
    secondary = WarmBrass,
    tertiary = CrimsonRich,
    background = SandalwoodCream,
    surface = PureWhite,
    onPrimary = Color.White,
    onSecondary = CharcoalStone,
    onTertiary = Color.White,
    onBackground = CharcoalStone,
    onSurface = CharcoalStone
)

@Composable
fun SwaraHeritageTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
