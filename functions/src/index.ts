import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestore = admin.firestore();

exports.newMensaje = functions.firestore
    .document('/mensajes/{mensajeId}')
    .onUpdate(async (event: any) => {
        var mensajes = event.after.data()
        var mensaje = mensajes.messages
        let ultMens = mensaje.length - 1;

        mensaje = mensaje[ultMens];
        if (mensaje.read !== true) {
            var emisor;
            var receptor;
            //se verifica quien es emisor y receptor
            if (mensaje.owner === mensajes.id[0]) {
                emisor = mensajes.id[0];
                receptor = mensajes.id[1];
            } else if (mensaje.owner === mensajes.id[1]) {
                emisor = mensajes.id[1];
                receptor = mensajes.id[0];
            } else {
                alert("no se puede detectar emisor y receptor")
            }
            //se trae token del receptor para enviar noti
            const path = '/usuarios/' + receptor;
            const docInfo = await firestore.doc(path).get()
            const dataUser = docInfo.data() as any;
            const token = dataUser.token;
            const registrationTokens = [token];
            //alert("newMessage ejecutado")
            const data = {
                ruta: '/folder/Mensajes'
            }
            const notification: INotification = {
                data: data,
                tokens: registrationTokens,
                notification: {
                    title: `Tenés un nuevo mensaje de ${emisor}`,
                    body: mensaje.content
                }
            }

            return sendNotification(notification);
        }

    })

exports.newChat = functions.firestore
    .document('/mensajes/{mensajeId}')
    .onCreate(async (event: any) => {
        var mensajes = event.after.data()
        var mensaje = mensajes.messages
        let ultMens = mensaje.length - 1;

        mensaje = mensaje[ultMens];

        var emisor;
        var receptor;
        //se verifica quien es emisor y receptor
        if (mensaje.owner === mensajes.id[0]) {
            emisor = mensajes.id[0];
            receptor = mensajes.id[1];
        } else if (mensaje.owner === mensajes.id[1]) {
            emisor = mensajes.id[1];
            receptor = mensajes.id[0];
        } else {
            alert("no se puede detectar emisor y receptor")
        }
        //se trae token del receptor para enviar noti
        const path = '/usuarios/' + receptor;
        const docInfo = await firestore.doc(path).get()
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;
        const registrationTokens = [token];
        const data = {
            ruta: '/folder/Mensajes'
        }
        const notification: INotification = {
            data: data,
            tokens: registrationTokens,
            notification: {
                title: `${emisor} ha iniciado una conversación con vos`,
                body: mensaje.content
            }
        }

        return sendNotification(notification);
    })

interface INotification {
    data: any;
    tokens: string[];
    notification: admin.messaging.Notification;
}

const sendNotification = (notification: INotification) => {
    return new Promise((resolve) => {
        const message: admin.messaging.MulticastMessage = {
            data: notification.data,
            tokens: notification.tokens,
            notification: notification.notification,
            android: {
                notification: {
                    icon: 'ic_stat_name',
                    color: '#EB9234'
                }
            }
        }
        admin.messaging().sendMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens: any[] = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(notification.tokens[idx])
                        }
                    });
                } else {
                    console.log("se envio correctamente")
                }
                resolve(true)
                return;
            }).catch(error => {
                console.log(`error al enviar noti ${error}`)
                resolve(false)
                return
            })
    })
}