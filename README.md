# Cinefilos PWA - Installation Guide

## Overview
Cinefilos is a Progressive Web App (PWA) that allows users to spin a wheel to randomly select movies to watch. The app includes movie recommendations, history tracking, and full offline functionality.

## Features
- 🎯 Interactive movie wheel spinner
- 📱 Installable on iPhone and other devices
- 🔄 Offline functionality with service worker
- 🎬 Movie recommendations based on directors
- 📜 Spin history tracking
- 🎨 Dark theme optimized for mobile
- 🔍 Movie search with autocomplete
- ⭐ Integration with OMDb API for movie data

## Files Included
- `index.html` - Main application file with enhanced PWA features
- `manifest.json` - Web app manifest for installation
- `service-worker.js` - Enhanced service worker for offline functionality
- `icon-*.png` - App icons in various sizes (16px to 512px)
- `icon-maskable-*.png` - Maskable icons for adaptive icon support
- `favicon.ico` - Favicon for browsers

## Installation on iPhone

### Method 1: Direct Installation (iOS 16.4+)
1. Open Safari on your iPhone
2. Navigate to your deployed PWA URL
3. Look for the install banner at the top
4. Tap "Install" to add to home screen

### Method 2: Manual Installation
1. Open Safari on your iPhone
2. Navigate to your deployed PWA URL
3. Tap the Share button (square with arrow up)
4. Scroll down and tap "Add to Home Screen"
5. Customize the name if desired
6. Tap "Add"

## Deployment Options

### Option 1: Static Hosting (Recommended)
Deploy to any static hosting service:
- **Netlify**: Drag and drop the folder to netlify.com/drop
- **Vercel**: Connect your GitHub repo or use CLI
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **Firebase Hosting**: Use Firebase CLI to deploy

### Option 2: Traditional Web Server
Upload all files to your web server's public directory. Ensure:
- HTTPS is enabled (required for PWA features)
- Proper MIME types are set for `.json` and `.js` files
- Service worker is served from the root domain

### Option 3: Local Testing
For development and testing:
```bash
# Navigate to the project directory
cd cinefilos-pwa

# Start a local server
python3 -m http.server 8080

# Or use Node.js
npx serve .

# Or use PHP
php -S localhost:8080
```

## PWA Requirements Met

### ✅ Web App Manifest
- Complete manifest.json with all required fields
- Multiple icon sizes (16px to 512px)
- Maskable icons for adaptive icon support
- Proper display mode and theme colors

### ✅ Service Worker
- Comprehensive caching strategies
- Offline functionality
- Background sync capabilities
- Cache management and updates

### ✅ HTTPS
- Required for PWA installation
- Ensure your hosting supports HTTPS

### ✅ Responsive Design
- Mobile-first design
- Touch-friendly interactions
- Safe area support for iOS devices
- Responsive breakpoints

### ✅ iOS Specific Features
- Apple touch icons
- iOS splash screens
- Status bar styling
- Viewport meta tags
- Touch callout disabled

## Browser Support
- ✅ Safari (iOS 11.3+)
- ✅ Chrome (Android/Desktop)
- ✅ Firefox (Android/Desktop)
- ✅ Edge (Desktop/Mobile)

## API Configuration
The app uses the OMDb API for movie data. The current API key is included for testing, but for production use:
1. Get your own API key from [omdbapi.com](http://www.omdbapi.com/apikey.aspx)
2. Replace the `apiKey` variable in the JavaScript code
3. Consider implementing server-side API calls for better security

## Customization
- **Colors**: Modify CSS custom properties in the `<style>` section
- **Movies**: Edit the `defaultEntries` array in JavaScript
- **Recommendations**: Update `popularMovieTitlesForRecommendations` array
- **Icons**: Replace icon files with your own designs

## Troubleshooting

### PWA Not Installing
- Ensure HTTPS is enabled
- Check that manifest.json is accessible
- Verify service worker is registering successfully
- Clear browser cache and try again

### Service Worker Issues
- Check browser console for errors
- Ensure service-worker.js is in the root directory
- Verify MIME type is set correctly for .js files

### iOS Installation Issues
- Use Safari browser (not Chrome or other browsers)
- Ensure iOS 11.3 or later
- Check that all meta tags are present
- Verify icon files are accessible

## Performance Optimization
- Icons are cached for offline use
- Movie posters are cached dynamically
- API responses are cached with network-first strategy
- Static assets use cache-first strategy

## Security Considerations
- API key should be moved to server-side for production
- Consider implementing rate limiting for API calls
- Validate all user inputs
- Use HTTPS for all external resources

## Support
For issues or questions about the PWA implementation, check:
- Browser developer console for errors
- Network tab for failed requests
- Application tab for service worker status
- Manifest tab for PWA installation criteria

# Cinefilos

## FotoFiesta Subpage
A lightweight photo booth experience is available in the `fotofiesta` folder. The page works completely offline and can be deployed on GitHub Pages just like the main app.

### Features
- **Fotos d la Cruda**: photos remain locked for a chosen delay before appearing in the gallery.
- **Fotos Instantáneas**: capture a quick strip of three photos with a countdown.
- Works as a PWA with its own manifest and service worker.

### Usage
Open `fotofiesta/index.html` in your browser or deploy the entire repository to GitHub Pages and navigate to `/fotofiesta/`.
You can also access FotoFiesta from the main page via the "Open FotoFiesta" button.
