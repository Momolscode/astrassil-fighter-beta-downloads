(()=> {
  const card=document.getElementById('ios-testflight-card');
  const note=document.getElementById('ios-native-note');
  if(!card)return;
  const validURL=value=>typeof value==='string'&&/^https:\/\/testflight\.apple\.com\/join\/[A-Za-z0-9]+$/.test(value);
  fetch('./ios-testflight.json',{cache:'no-store',credentials:'omit',redirect:'error'})
    .then(response=>response.ok?response.json():Promise.reject(new Error('manifest')))
    .then(data=>{
      if(!data||data.schema!=='astrassil-ios-testflight/1'||data.ready!==true||!validURL(data.testFlightURL))return;
      const link=card.querySelector('[data-ios-testflight]');
      const version=card.querySelector('[data-ios-version]');
      if(!link)return;
      link.href=data.testFlightURL;
      if(version&&typeof data.version==='string')version.textContent=data.version+(Number.isSafeInteger(data.build)?' · build '+data.build:'');
      card.hidden=false;
      if(note)note.hidden=true;
    })
    .catch(()=>{});
})();
