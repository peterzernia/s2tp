import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { shape } from 'prop-types'
import { helpScreenStyles as styles } from './styles'

export default function HelpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.helpText}>
          Your organization is the name used in your
          Target Process domain name:
          {'\n'}
          &#60;organization&#62;.tpondemand.com
        </Text>
        <Text style={styles.helpText}>
          You can create/find your Target Process access token by visiting
          your profile page of your Target Process account and selecting
          the &rsquo;Access Tokens&rsquo; tab.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

HelpScreen.propTypes = {
  navigation: shape({}).isRequired,
}
