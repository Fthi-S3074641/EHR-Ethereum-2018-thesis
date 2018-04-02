<template>
  <div id="app">
        <div class="navbar-fixed">
            <nav>
                <div class="nav-wrapper">
                <a href="#" class="brand-logo right">Ethereum EHR System</a>
                <ul id="nav-mobile" class="left hide-on-med-and-down">
                    <li><router-link class="link" to="/forms/registration">Registration</router-link></li>
                    <li><router-link class="link" to="/forms/payments">Payments</router-link></li>
                    <li><router-link class="link" to="/forms/control"> Access control </router-link></li>
                </ul>
                </div>
            </nav>
                </div>
<router-view> </router-view>
  </div>
</template>

