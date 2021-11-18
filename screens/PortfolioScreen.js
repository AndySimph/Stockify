import * as React from 'react'
import { useContext } from 'react'
import { StyleSheet, Pressable } from 'react-native'

import { Text, View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import Firebase from '../services/firebase'
import { IconButton, Button } from '../components'
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider'

const auth = Firebase.auth();
db = Firebase.firestore()

//class that would store data from database document (only balance for now)
class userData {
    constructor(balance) {
        this.balance = balance;
    }
    getBalance() {
        return this.balance;
    }
}
//function used to pull data from document and return new object with data
var balanceGet = {
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options)
        return new userData(data.balance);
    }
}

export default function PortfolioScreen() {
    const { user } = useContext(AuthenticatedUserContext);
    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error)
        }
    };
    const uid = user.uid;
    let balance = 0;
    //get document from database
    db.collection("users").doc(uid)
        .withConverter(balanceGet)
        .get().then((doc) => {
            //store data in new object
            var uData = doc.data();
            //put balance into a variable to use
            balance = uData.getBalance();
            //console.log(uData.getBalance());
        })
    //text with {balance} would display balance of the user
    return (
        <View style={styles.container}>
            <Text style={styles.title2}>{user.email}</Text>
            <Text style={styles.title}>Portfolio</Text>
            <Text style={styles.title}>{balance}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <IconButton
                onPress={handleSignOut}
                name='logout'
                size={24}
                color='#000'
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    title2: {
        fontSize: 15,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
//button that was going to be for testing
    /* <Button
                
                backgroundColor='#bcbcbc'
                title='Increase'
                titleColor='#000'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24
                }}
            /> */