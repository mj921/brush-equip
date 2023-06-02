import Message from '@/components/message.vue';

export default function (Vue) {
  let BeMessage = Vue.extend(Message);
  Vue.prototype.$message = (opt) => {
    let message = new BeMessage({ propsData: opt });
    document.body.appendChild(message.$mount().$el);
    setTimeout(function () {
      document.body.removeChild(message.$mount().$el);
      message.$destroy();
    }, opt.time || 3000);
  };
}
