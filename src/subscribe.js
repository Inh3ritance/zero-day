/*
const vapid_key = process.env.REACT_APP_PUBLIC_VAPID_KEY;
const api = process.env.REACT_APP_API_URL;
const convertedVapidKey = urlBase64ToUint8Array(vapid_key);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function sendSubscription(subscription) {
  return fetch(`${api}/subscribe`, {
    method: 'POST',
    body: JSON.stringify({
      oldSubscription: window.localStorage.getItem('old_subscription') ? JSON.parse(window.localStorage.getItem('old_subscription')) : null,
      newSubscription: subscription,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.localStorage.setItem('new_subscription', JSON.stringify(subscription));
  }).catch(err => {
    console.log(err);
  });
}

export function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then((existedSubscription) => {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          }).then(function(newSubscription) {
            console.log('New subscription added.')
            if(window.localStorage.getItem('new_subscription')) {
              window.localStorage.setItem('old_subscription', window.localStorage.getItem('new_subscription'));
            }
            sendSubscription(newSubscription);
          }).catch(function(e) {
            if (Notification.permission !== 'granted') {
              console.log('Permission was not granted.')
            } else {
              console.error('An error ocurred during the subscription process.', e)
            }
          });
        } else {
          console.log('Existed subscription detected.')
        }
      })
    }).catch((e) => {
      console.error('An error ocurred during Service Worker registration.', e)
    });
  }
}*/