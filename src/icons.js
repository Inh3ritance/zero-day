// In order to use RNVI for web, you need to consume the ttf files in your JavaScript entry point to get the bundled url and inject a style tag in your page
// https://github.com/oblador/react-native-vector-icons#web-with-webpack

import AntDesignTTF from 'react-native-vector-icons/Fonts/AntDesign.ttf';
import EntypoTTF from 'react-native-vector-icons/Fonts/Entypo.ttf';
import EvilIconsTTF from 'react-native-vector-icons/Fonts/EvilIcons.ttf';
import FeatherTTF from 'react-native-vector-icons/Fonts/Feather.ttf';
import FontAwesomeTTF from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import FontistoTTF from 'react-native-vector-icons/Fonts/Fontisto.ttf';
import FoundationTTF from 'react-native-vector-icons/Fonts/Foundation.ttf';
import IoniconsTTF from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import MaterialIconsTTF from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import MaterialCommunityIconsTTF from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import OcticonsTTF from 'react-native-vector-icons/Fonts/Octicons.ttf';
import ZocialTTF from 'react-native-vector-icons/Fonts/Zocial.ttf';
import SimpleLineIconsTTF from 'react-native-vector-icons/Fonts/SimpleLineIcons.ttf';

// Generate required css
const IconsCSS = `
@font-face {
  src: url(${AntDesignTTF});
  font-family: AntDesign;
}
@font-face {
  src: url(${EntypoTTF});
  font-family: Entypo;
}
@font-face {
  src: url(${EvilIconsTTF});
  font-family: EvilIcons;
}
@font-face {
  src: url(${FeatherTTF});
  font-family: Feather;
}
@font-face {
  src: url(${FontAwesomeTTF});
  font-family: FontAwesome;
}
@font-face {
  src: url(${FontistoTTF});
  font-family: Fontisto;
}
@font-face {
  src: url(${FoundationTTF});
  font-family: Foundation;
}
@font-face {
  src: url(${IoniconsTTF});
  font-family: Ionicons;
}
@font-face {
  src: url(${MaterialIconsTTF});
  font-family: Materialicons;
}
@font-face {
  src: url(${MaterialCommunityIconsTTF});
  font-family: MaterialCommunityIcons;
}
@font-face {
  src: url(${OcticonsTTF});
  font-family: Octicons;
}
@font-face {
  src: url(${ZocialTTF});
  font-family: Zocial;
}
@font-face {
  src: url(${SimpleLineIconsTTF});
  font-family: SimpleLineIcons;
}
`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = IconsCSS;
} else {
  style.appendChild(document.createTextNode(IconsCSS));
}

// Inject stylesheet
document.head.appendChild(style);
