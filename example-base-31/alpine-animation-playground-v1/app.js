window.animationPlayground = function animationPlayground() {
  return {
    filter: 'all',
    duration: 0.8,
    modalOpen: false,
    toastVisible: false,
    toastTimer: null,
    runs: {},
    items: [
      {id:'fade', number:'01', title:'Fade in', category:'entrance', description:'A soft opacity transition.'},
      {id:'slide', number:'02', title:'Slide up', category:'entrance', description:'Enter from below with ease.'},
      {id:'bounce', number:'03', title:'Bounce', category:'entrance', description:'A playful spring-like landing.'},
      {id:'rotate', number:'04', title:'Rotate', category:'entrance', description:'A full spin with a little scale.'},
      {id:'pulse', number:'05', title:'Pulse', category:'interaction', description:'A subtle attention-grabbing beat.'},
      {id:'flip', number:'06', title:'3D flip', category:'interaction', description:'Flip between two faces in 3D.'},
      {id:'shake', number:'07', title:'Shake', category:'interaction', description:'A quick horizontal shake.'},
      {id:'swing', number:'08', title:'Swing', category:'interaction', description:'Pendulum movement from the top.'},
      {id:'heartbeat', number:'09', title:'Heartbeat', category:'interaction', description:'A two-beat scale animation.'},
      {id:'modal', number:'10', title:'Modal', category:'interaction', description:'Scale and fade with x-transition.'},
      {id:'toast', number:'11', title:'Toast notification', category:'interaction', description:'A message enters and disappears.'}
    ],
    get visibleItems() {
      return this.filter === 'all' ? this.items : this.items.filter(item => item.category === this.filter);
    },
    play(id) {
      if (id === 'modal') { this.modalOpen = true; return; }
      if (id === 'toast') { this.showToast(); return; }
      this.runs[id] = false;
      this.$nextTick(() => { this.runs[id] = true; });
    },
    replayAll() {
      this.items.forEach(item => this.play(item.id));
    },
    showToast() {
      this.toastVisible = true;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.toastVisible = false, 2200);
    }
  };
}
