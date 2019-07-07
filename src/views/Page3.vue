<template>
	<div class="code-content">
		<prism language="ruby">
control "V-38437" do
  title "Automated file system mounting tools must not be enabled unless
needed."
  desc  "All filesystems that are required for the successful operation of the
system should be explicitly listed in \"/etc/fstab\" by an administrator. New
filesystems should not be arbitrarily introduced via the automounter.
    The \"autofs\" daemon mounts and unmounts filesystems, such as user home
directories shared via NFS, on demand. In addition, autofs can be used to
handle removable media, and the default configuration provides the cdrom device
as \"/misc/cd\". However, this method of providing access to removable media is
not common, so autofs can almost always be disabled if NFS is not in use. Even
if NFS is required, it is almost always possible to configure filesystem mounts
statically by editing \"/etc/fstab\" rather than relying on the automounter.
		</prism>
	</div>
</template>

<script>
import Prism from 'vue-prism-component'
import 'prismjs/components/prism-ruby'


export default {
	components : {
		Prism
	}
}
</script>

<style>

</style>
