'use strict';
const list=document.querySelector('#video-list');
const status=document.querySelector('#data-state');
const filters=[...document.querySelectorAll('[data-filter]')];
let videos=[];
function render(kind='all'){
 list.replaceChildren();
 const selected=videos.filter(v=>kind==='all'||v.kind===kind).slice(0,kind==='all'?6:9);
 for(const video of selected){
  if(!/^[A-Za-z0-9_-]{11}$/.test(video.id))continue;
  const card=document.createElement('article');card.className=`video-card ${video.kind==='longform'?'featured':''}`;
  const link=document.createElement('a');link.href=`https://www.youtube.com/watch?v=${video.id}`;link.target='_blank';link.rel='noopener';
  const meta=document.createElement('div');meta.className='video-meta';
  const label=document.createElement('span');label.className='video-kind';label.textContent=video.kind==='longform'?'위기의 기록 · LONGFORM':'짧게 보는 금융 · SHORTS';
  const date=document.createElement('time');date.dateTime=video.publishedAt;date.textContent=new Date(video.publishedAt).toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'});
  const title=document.createElement('h3');title.textContent=video.title;
  const watch=document.createElement('span');watch.className='watch';watch.textContent='YouTube에서 이야기 보기 ↗';
  meta.append(label,date);link.append(meta,title,watch);card.append(link);list.append(card);
 }
 if(!selected.length){const p=document.createElement('p');p.textContent='이 유형의 공개 영상은 준비 중입니다.';list.append(p);}
}
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(button.dataset.filter);}));
fetch('data/videos.json').then(response=>{if(!response.ok)throw new Error('feed unavailable');return response.json();}).then(data=>{
 videos=data.videos;render();status.textContent=`공개 영상만 표시 · ${new Date(data.updatedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} KST 업데이트`;
}).catch(()=>{status.textContent='영상 목록을 불러오지 못했습니다. 상단 YouTube 링크에서 최신 영상을 확인해 주세요.';});
document.querySelector('form')?.addEventListener('submit',event=>event.preventDefault());
