<template>
  <div class="modal fade show d-block modal-bg" role="dialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Invitation received</h3>
        </div>
        <div class="modal-body">
          <h6>
            <span class="text-primary">{{ props.invite.nickname }}</span>
            invited you to play a
            <span class="text-primary">{{ props.invite.type }}</span> game.
          </h6>
        </div>
        <div class="modal-footer w-100">
          <div class="row w-100">
            <div class="col-6">
              <button @click="acceptInvite()" class="btn btn-success w-100">
                <div>
                  Accept
                  <i class="ms-1 bi-check-square-fill" />
                </div>
              </button>
            </div>
            <div class="col-6">
              <button @click="refuseInvite()" class="btn btn-danger w-100">
                <div>
                  Refuse
                  <i class="ms-1 bi-x-square-fill" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script setup lang="ts">
import { store } from "@/store";
import { defineProps } from "vue";

const props = defineProps(["invite"]);

function acceptInvite() {
  store.dispatch("game/acceptInvite", props.invite);
}

function refuseInvite() {
  store.dispatch("game/refuseInvite", props.invite);
}
</script>

<style scoped>
.modal-bg {
  background: rgba(0, 0, 0, 0.25) !important;
}
</style>