import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from "../views/Login.vue"
import SecureComponent from "../views/Secure.vue"
import PasswordComponent from "../views/Password.vue"
import PageNotFound from "../views/PageNotFound.vue"

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: {
      name: "login"
    }
  },
  {
    path: "/login",
    name: "login",
    component: LoginComponent,
    meta: {
      title: 'Login | Todobox',
      metaTags: [
        {
          name: 'description',
          content: 'This is the login interface for Todobox'
        },
        {
          property: 'og:description',
          content: 'This is the login interface for Todobox'
        }
      ]
    }
  },
  {
    path: "/password",
    name: "password",
    component: PasswordComponent,
    meta: {
      title: 'Password | Todobox',
      metaTags: [
        {
          name: 'description',
          content: 'Page that showing access details for Todobox'
        },
        {
          property: 'og:description',
          content: 'Page that showing access details for Todobox'
        }
      ]
    }
  },
  {
    path: "/home",
    name: "secure",
    component: SecureComponent,
    meta: {
      title: 'Home | Todobox',
      metaTags: [
        {
          name: 'description',
          content: 'Home page for Todobox'
        },
        {
          property: 'og:description',
          content: 'Home page for Todobox'
        }
      ]
    }
  },
  { path: "*", component: PageNotFound }
]




const router = new Router({
  routes,
  mode: 'history'
})


router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router
