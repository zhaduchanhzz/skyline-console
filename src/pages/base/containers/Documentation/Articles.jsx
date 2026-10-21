/* eslint-disable spellcheck/spell-checker */
import React from 'react';
import PropTypes from 'prop-types';

function CodeBlock({ children }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

CodeBlock.propTypes = {
  children: PropTypes.string.isRequired,
};

const imageExamples = [
  {
    id: 'ubuntu',
    title: 'Ubuntu',
    description:
      'Download the current Ubuntu server cloud image for the release you operate. Ubuntu cloud images normally include cloud-init and use the ubuntu account. The example assumes a verified QCOW2 file for Ubuntu 24.04.',
    filename: 'ubuntu-24.04.qcow2',
    name: 'Ubuntu 24.04',
    distro: 'ubuntu',
    version: '24.04',
    user: 'ubuntu',
  },
  {
    id: 'debian',
    title: 'Debian',
    description:
      'Choose a current Debian generic cloud image. Check its published checksum and confirm the login account used by that particular build before giving users access.',
    filename: 'debian-12-genericcloud-amd64.qcow2',
    name: 'Debian 12',
    distro: 'debian',
    version: '12',
    user: 'debian',
  },
  {
    id: 'centos',
    title: 'CentOS Stream',
    description:
      'Use a maintained CentOS Stream GenericCloud artifact. The default account differs between image publishers and releases; inspect the image documentation and replace the sample cloud-user value if necessary.',
    filename: 'centos-stream-9.qcow2',
    name: 'CentOS Stream 9',
    distro: 'centos',
    version: '9',
    user: 'cloud-user',
  },
  {
    id: 'coreos',
    title: 'Fedora CoreOS',
    description:
      'Select the OpenStack QCOW2 artifact for the intended Fedora CoreOS stream. The publisher may distribute it as .qcow2.xz; decompress it before upload. Provision users and SSH keys through Ignition, and verify the image metadata expected by your Kubernetes or Magnum driver.',
    filename: 'fedora-coreos-openstack.qcow2',
    name: 'Fedora CoreOS',
    distro: 'fedora',
    version: null,
    user: 'core',
  },
  {
    id: 'opensuse',
    title: 'openSUSE Leap',
    description:
      'Get a maintained openSUSE Leap cloud image built for OpenStack or KVM. Confirm its architecture, firmware, package updates, and default account before making it visible to other projects.',
    filename: 'opensuse-leap.qcow2',
    name: 'openSUSE Leap',
    distro: 'opensuse',
    version: '15',
    user: 'opensuse',
  },
  {
    id: 'sles',
    title: 'SUSE Linux Enterprise Server',
    description:
      'Obtain a cloud-ready SLES image through an authorized SUSE channel. Ensure the guest has the required registration method and that its use complies with your subscription.',
    filename: 'sles-cloud.qcow2',
    name: 'SLES',
    distro: 'sles',
    version: '15',
    user: 'sles',
  },
  {
    id: 'rhel',
    title: 'Red Hat Enterprise Linux',
    description:
      'Use a licensed RHEL KVM guest image from an authorized account. Confirm that the guest registration and update workflow is ready before publishing it.',
    filename: 'rhel-9-kvm.qcow2',
    name: 'RHEL 9',
    distro: 'rhel',
    version: '9',
    user: 'cloud-user',
  },
];

function imageCreateCommand(example) {
  const versionProperty = example.version
    ? `  --property os_version=${example.version} ${String.fromCharCode(
        92,
        10
      )}`
    : '';
  return `openstack image create "${example.name}" \\
  --file "${example.filename}" \\
  --disk-format qcow2 --container-format bare --private \\
  --property os_type=linux \\
  --property os_distro=${example.distro} \\
${versionProperty}  --property os_admin_user=${example.user}`;
}

export function FlavorArticle() {
  return (
    <article className="docs-article" id="flavors">
      <h2>Compute flavors</h2>
      <p>
        A flavor describes the virtual CPU, memory, and disk resources offered
        to a new instance. Operators can also attach extra specifications that
        affect placement or hardware behavior. The flavors visible in your
        console are supplied by your connected OpenStack cloud; no particular
        set of sizes is guaranteed by this guide.
      </p>

      <h3>Understand a flavor before selecting it</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Field</th>
            <th scope="col">What it controls</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>vCPU</td>
            <td>The virtual processor count exposed to the guest.</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>Guest memory, specified in MiB by the OpenStack CLI.</td>
          </tr>
          <tr>
            <td>Root disk</td>
            <td>
              Local root disk size in GiB. For a volume-backed instance, the
              boot volume size is managed separately; check the cloud policy
              before using a zero-disk flavor.
            </td>
          </tr>
          <tr>
            <td>Ephemeral disk</td>
            <td>
              Additional local disk in GiB. Its data is not a substitute for
              durable block storage.
            </td>
          </tr>
          <tr>
            <td>Swap</td>
            <td>Optional local swap space, specified in MiB.</td>
          </tr>
          <tr>
            <td>Visibility</td>
            <td>
              Public flavors are available across projects; private flavors
              require explicit project access.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Naming and size families</h3>
      <p>
        A useful naming convention describes the workload family and resource
        size, for example <code>general.2x4</code> for two vCPUs and 4 GiB of
        RAM. Some operators also encode a hardware generation in the name. Names
        are conventions, not OpenStack-enforced resource definitions; always
        inspect the flavor details. Common families include general purpose,
        compute optimized, memory optimized, and accelerated computing.
      </p>
      <ul>
        <li>
          General purpose favors a balanced CPU-to-memory ratio for web and
          application servers.
        </li>
        <li>
          Compute optimized offers more CPU relative to memory for parallel work
          or CPU-heavy services.
        </li>
        <li>
          Memory optimized offers more RAM per vCPU for caches and large
          in-memory workloads.
        </li>
        <li>
          Accelerated flavors may request GPUs or other PCI devices and only
          work on hosts configured to provide them.
        </li>
      </ul>
      <p>
        The following values are examples for planning, not predefined Sovereign
        sizes or prices.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Example</th>
            <th scope="col">vCPU</th>
            <th scope="col">RAM</th>
            <th scope="col">Root disk</th>
            <th scope="col">Typical starting point</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>general.2x4</td>
            <td>2</td>
            <td>4 GiB</td>
            <td>40 GiB</td>
            <td>Small application service</td>
          </tr>
          <tr>
            <td>general.4x8</td>
            <td>4</td>
            <td>8 GiB</td>
            <td>80 GiB</td>
            <td>Application or test database</td>
          </tr>
          <tr>
            <td>compute.8x16</td>
            <td>8</td>
            <td>16 GiB</td>
            <td>80 GiB</td>
            <td>CPU-heavy batch job</td>
          </tr>
          <tr>
            <td>memory.4x32</td>
            <td>4</td>
            <td>32 GiB</td>
            <td>80 GiB</td>
            <td>Large in-memory process</td>
          </tr>
        </tbody>
      </table>

      <h3>Create and inspect a flavor</h3>
      <p>
        Flavor administration requires an account with the relevant compute
        permissions. The example below creates a public flavor. Choose values
        that match the cloud capacity and the guest image requirements.
      </p>
      <CodeBlock>{`openstack flavor create general.2x4 \\
  --vcpus 2 --ram 4096 --disk 40 --public
openstack flavor show general.2x4
openstack flavor list --long`}</CodeBlock>
      <p>
        To limit use to a project, create a private flavor and grant access to
        that project. A project name can be ambiguous across domains, so use its
        ID where practical.
      </p>
      <CodeBlock>{`openstack flavor create project.2x4 \\
  --vcpus 2 --ram 4096 --disk 40 --private
openstack flavor set --project PROJECT_ID project.2x4
openstack flavor show project.2x4`}</CodeBlock>

      <h3>Extra specifications</h3>
      <p>
        Extra specs are key-value pairs on a flavor. Nova, Placement, the
        hypervisor driver, or an operator extension may interpret them. Do not
        assume a key changes behavior until it is supported and configured in
        the target cloud. An extra spec can also make a flavor unschedulable
        when no host satisfies the request.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Example key</th>
            <th scope="col">Purpose and constraint</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>hw:mem_page_size</code>
            </td>
            <td>
              Requests a guest memory page size, such as <code>large</code>.
              Large pages require host configuration and available capacity.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw:cpu_policy</code>
            </td>
            <td>
              Can request dedicated CPU placement when CPU pinning is enabled
              and capacity is available.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw:cpu_max_threads</code>, <code>hw:cpu_max_sockets</code>
            </td>
            <td>
              Limit the guest CPU topology that an image or user can request.
              These are maximum values, not a reservation of host threads or
              sockets, and depend on the libvirt driver.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw:numa_nodes</code>
            </td>
            <td>
              Requests a guest NUMA topology. CPU and memory must fit the host
              topology.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw:pci_numa_affinity_policy</code>
            </td>
            <td>
              Controls the placement preference for PCI devices and SR-IOV
              interfaces relative to guest CPUs. The preferred policy allows
              fallback when a same-node device is unavailable.
            </td>
          </tr>
          <tr>
            <td>
              <code>pci_passthrough:alias</code>
            </td>
            <td>
              Requests a configured PCI device alias, which may represent a GPU
              or NIC.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw:hide_hypervisor_id</code>
            </td>
            <td>
              Optionally hides the hypervisor signature from a guest when a
              driver requires it. Confirm the effect with the guest vendor.
            </td>
          </tr>
          <tr>
            <td>
              <code>trait:...</code> and <code>resources:...</code>
            </td>
            <td>
              Express Placement trait and resource requirements when the
              deployment exposes the matching inventory.
            </td>
          </tr>
          <tr>
            <td>
              <code>:category</code>, <code>:architecture</code>
            </td>
            <td>
              Optional console display metadata used by some deployments to
              group flavors. These keys do not allocate hardware or change
              placement by themselves.
            </td>
          </tr>
          <tr>
            <td>
              <code>quota:vif_*_average</code>, <code>quota:vif_*_peak</code>,
              <code>quota:vif_*_burst</code>
            </td>
            <td>
              Libvirt virtual-interface traffic limits for inbound and outbound
              directions where supported. Average and peak are in kilobytes per
              second; burst is in kilobytes. A Neutron QoS policy may be the
              appropriate control in other deployments.
            </td>
          </tr>
        </tbody>
      </table>
      <CodeBlock>{`openstack flavor set general.2x4 \\
  --property hw:mem_page_size=any
openstack flavor show general.2x4
openstack flavor unset --property hw:mem_page_size general.2x4`}</CodeBlock>

      <h3>Scheduling, affinity, and bandwidth</h3>
      <p>
        A flavor can narrow host selection through traits, resource classes,
        aggregate metadata, and hardware-specific extra specs. Coordinate these
        choices with the compute operator; a valid flavor can still fail to boot
        if the requested hardware is absent, exhausted, or excluded by another
        policy. A bandwidth cap should be designed with the network operator and
        applied through the cloud&apos;s supported QoS mechanism. Bandwidth
        settings in a flavor are deployment dependent and do not automatically
        reserve network capacity.
      </p>
      <p>
        To target a CPU vendor, an operator can attach a custom Placement trait
        to the relevant compute providers and require that trait from a flavor.
        The trait name below is an example; it works only after the operator has
        created and assigned it. Older environments sometimes use
        <code> capabilities:cpu_info:vendor</code> with a scheduler filter, but
        that behavior is not guaranteed on modern clouds.
      </p>
      <CodeBlock>{`openstack flavor set general.2x4 \\
  --property trait:CUSTOM_CPU_VENDOR_INTEL=required`}</CodeBlock>
      <p>
        If the deployment supports libvirt VIF quotas, all three limits can be
        specified for each direction. In this illustration, sustained inbound
        and outbound rates are 125000 kB/s, with 250000 kB/s peak and 250000 kB
        burst allowances. Check the cloud&apos;s networking model before
        applying these properties.
      </p>
      <CodeBlock>{`openstack flavor set general.2x4 \\
  --property quota:vif_inbound_average=125000 \\
  --property quota:vif_inbound_peak=250000 \\
  --property quota:vif_inbound_burst=250000 \\
  --property quota:vif_outbound_average=125000 \\
  --property quota:vif_outbound_peak=250000 \\
  --property quota:vif_outbound_burst=250000`}</CodeBlock>

      <h3>NUMA and huge pages</h3>
      <p>
        NUMA-aware flavors can improve predictable performance for workloads
        sensitive to memory locality. They also reduce the number of hosts that
        can satisfy a request. Test the layout with the intended image and host
        CPU topology before publishing the flavor widely.
      </p>
      <CodeBlock>{`openstack flavor create numa.8x32 \\
  --vcpus 8 --ram 32768 --disk 80 --private
openstack flavor set numa.8x32 \\
  --property hw:numa_nodes=2 \\
  --property hw:cpu_policy=dedicated`}</CodeBlock>
      <p>
        Dedicated CPU and huge-page requests need matching host reservation and
        memory configuration. Set <code>hw:mem_page_size</code> only after
        confirming that the host and guest support the requested size.
      </p>
      <p>
        PCI NUMA affinity is a separate choice from the number of guest NUMA
        nodes. The preferred policy tries to keep a PCI device or SR-IOV
        interface near the guest CPUs but can fall back to another node. Confirm
        that the workload tolerates that possible performance change.
      </p>
      <CodeBlock>{`openstack flavor set numa.8x32 \\
  --property hw:pci_numa_affinity_policy=preferred`}</CodeBlock>

      <h3>GPU and other PCI devices</h3>
      <p>
        PCI passthrough must be enabled on the compute hosts and exposed through
        an alias before a flavor can request it. The alias name below is
        illustrative; obtain the real alias from your operator. Check GPU count,
        NUMA affinity, drivers, and whether devices are dedicated or shared.
      </p>
      <CodeBlock>{`openstack flavor create gpu.8x32 \\
  --vcpus 8 --ram 32768 --disk 80 --private
openstack flavor set gpu.8x32 \\
  --property pci_passthrough:alias=gpu:1`}</CodeBlock>
      <p>
        Some guests require the hypervisor signature to be hidden before a
        device driver will load. This is optional and should be tested with the
        guest image, not enabled for every GPU flavor.
      </p>
      <CodeBlock>{`openstack flavor set gpu.8x32 \\
  --property hw:hide_hypervisor_id=true`}</CodeBlock>

      <h3>Why create custom flavors?</h3>
      <p>
        Matching sizes to workloads can reduce wasted CPU, RAM, and disk while
        giving demanding services the resources they need. Fewer oversized
        instances may reduce capacity use and cost. Specialized hardware
        requests can improve performance, but they also narrow placement options
        and increase operational complexity. Publish a small, clear catalog and
        measure utilization before adding many near-duplicate sizes.
      </p>

      <h3>Operational checks</h3>
      <ol>
        <li>Confirm that the project can see the flavor.</li>
        <li>
          Check CPU, RAM, local disk, quotas, and available capacity in the
          desired availability zone.
        </li>
        <li>
          Confirm that image architecture, firmware, and any special flavor
          requirements are compatible.
        </li>
        <li>
          Launch a test instance and inspect scheduler and compute logs if
          placement fails.
        </li>
      </ol>
    </article>
  );
}

export function ImageArticle() {
  return (
    <article className="docs-article" id="images">
      <h2>Glance images</h2>
      <p>
        An image is a bootable disk template stored by the OpenStack Image
        service, Glance. Users select an image and a flavor when creating an
        instance. Image availability, visibility, supported operating systems,
        and upload permissions depend on the connected cloud.
      </p>

      <h3>Prepare an image safely</h3>
      <ol>
        <li>
          Obtain a cloud-ready image from the operating system publisher or an
          approved internal build pipeline. Confirm its license and support
          period.
        </li>
        <li>
          Verify the publisher&apos;s checksum or signature and scan the
          artifact according to your organization&apos;s policy.
        </li>
        <li>
          Inspect the actual file format. A filename extension is not enough; a
          compressed download must be decompressed before declaring its disk
          format.
        </li>
        <li>
          Confirm architecture, BIOS or UEFI boot mode, cloud-init or
          Cloudbase-Init, the default account, and guest-agent support.
        </li>
        <li>
          Keep credentials, private keys, machine identities, and other
          per-instance secrets out of reusable images.
        </li>
      </ol>
      <CodeBlock>{`sha256sum ./guest-image.qcow2
qemu-img info ./guest-image.qcow2`}</CodeBlock>
      <p>
        These inspection commands run on a workstation with the relevant tools
        installed. Compare the checksum with a trusted publisher value.
      </p>

      <h3>Disk and container formats</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Format</th>
            <th scope="col">Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>qcow2</code>
            </td>
            <td>Common QEMU copy-on-write guest disk format.</td>
          </tr>
          <tr>
            <td>
              <code>raw</code>
            </td>
            <td>Unstructured disk bytes, often larger on disk.</td>
          </tr>
          <tr>
            <td>
              <code>vhd</code>, <code>vhdx</code>, <code>vmdk</code>, or{' '}
              <code>iso</code>
            </td>
            <td>
              Supported by Glance in some workflows, subject to hypervisor and
              cloud image policy.
            </td>
          </tr>
          <tr>
            <td>
              <code>bare</code> container
            </td>
            <td>
              Normal choice for a single bootable disk file. This is separate
              from the disk format.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Glance validates the uploaded data against the declared disk format on
        many deployments. Match <code>--disk-format</code> to the actual
        uncompressed file. When booting from a volume, also make sure the
        destination volume is large enough for the image.
      </p>

      <h3>Image metadata</h3>
      <p>
        Properties help users and other OpenStack services interpret an image.
        Only set a property when it accurately describes the artifact. Some
        properties affect placement or guest boot and may be restricted by
        administrator policy.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>os_type</code>, <code>os_distro</code>,{' '}
              <code>os_version</code>
            </td>
            <td>Operating system family, distribution, and version.</td>
          </tr>
          <tr>
            <td>
              <code>os_admin_user</code>
            </td>
            <td>
              Expected privileged login name; verify against the actual image
              build.
            </td>
          </tr>
          <tr>
            <td>
              <code>architecture</code>
            </td>
            <td>Guest architecture, such as x86_64 or aarch64.</td>
          </tr>
          <tr>
            <td>
              <code>hw_firmware_type</code>, <code>hw_machine_type</code>
            </td>
            <td>
              Firmware and machine type requests. Use only when compatible with
              the image and compute hosts.
            </td>
          </tr>
          <tr>
            <td>
              <code>img_config_drive</code>
            </td>
            <td>
              Indicates whether a configuration drive is optional or required
              for instance metadata delivery. Guest support is necessary.
            </td>
          </tr>
          <tr>
            <td>
              <code>hypervisor_type</code>
            </td>
            <td>
              Limits use to a compatible hypervisor type when the cloud
              interprets this property. Do not set it merely because the image
              file has a QCOW2 extension.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw_qemu_guest_agent</code>
            </td>
            <td>
              Indicates that guest-agent integration is intended; the agent must
              also be installed and running inside the guest.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw_vif_multiqueue_enabled</code>
            </td>
            <td>
              May enable multiqueue virtual NIC behavior on supported drivers.
            </td>
          </tr>
          <tr>
            <td>
              <code>hw_disk_bus</code>, <code>hw_scsi_model</code>
            </td>
            <td>Storage bus and SCSI controller selection where supported.</td>
          </tr>
          <tr>
            <td>
              <code>os_require_quiesce</code>
            </td>
            <td>
              Indicates that consistent snapshots require guest quiescing;
              verify guest-agent support before enabling it.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Default login names</h3>
      <p>
        The account name is an image-build detail, not an OpenStack-wide
        default. Inspect the publisher documentation and the image&apos;s{' '}
        <code>os_admin_user</code> property. Password login may be disabled;
        most cloud images expect an injected SSH key or other first-boot
        provisioning.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Image family</th>
            <th scope="col">Common starting account</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ubuntu</td>
            <td>ubuntu</td>
          </tr>
          <tr>
            <td>Debian</td>
            <td>debian</td>
          </tr>
          <tr>
            <td>CentOS Stream</td>
            <td>Often cloud-user or centos; check the build</td>
          </tr>
          <tr>
            <td>Fedora CoreOS</td>
            <td>core, configured through Ignition</td>
          </tr>
          <tr>
            <td>openSUSE Leap</td>
            <td>Often opensuse</td>
          </tr>
          <tr>
            <td>SLES</td>
            <td>Often sles</td>
          </tr>
          <tr>
            <td>RHEL</td>
            <td>Often cloud-user</td>
          </tr>
          <tr>
            <td>Windows</td>
            <td>Administrator after image-specific initialization</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock>{`openstack image show "Ubuntu 24.04" -f yaml
openstack image list --long`}</CodeBlock>

      <h3>Upload workflow</h3>
      <p>
        Authenticate the OpenStack CLI to the intended cloud and project, then
        upload a verified local file. The example keeps the image private while
        it is tested. Public visibility requires appropriate permissions and
        makes the image available to other projects.
      </p>
      <CodeBlock>{`openstack image create "Example Linux" \\
  --file ./guest-image.qcow2 \\
  --disk-format qcow2 --container-format bare --private \\
  --property os_type=linux \\
  --property os_distro=ubuntu \\
  --property os_admin_user=ubuntu
openstack image show "Example Linux"`}</CodeBlock>
      <p>
        Add optional hardware properties only after verifying the image and
        compute fleet. For example, a UEFI guest that includes the QEMU guest
        agent and supports virtio multiqueue can use a profile like this:
      </p>
      <CodeBlock>{`openstack image set "Example Linux" \\
  --property hw_qemu_guest_agent=yes \\
  --property hw_vif_multiqueue_enabled=true \\
  --property img_config_drive=optional \\
  --property hw_machine_type=q35 \\
  --property hw_firmware_type=uefi \\
  --property os_require_quiesce=yes`}</CodeBlock>
      <p>
        Quiescing requires working guest integration and is useful for
        consistent snapshots. A guest without UEFI support should not request
        UEFI firmware. Disk bus, SCSI model, and hypervisor type can also be
        specified when a cloud operator has validated those choices.
      </p>
      <ol>
        <li>Wait until the image status is active.</li>
        <li>
          Inspect the recorded disk format, size, visibility, and properties.
        </li>
        <li>
          Launch a small test instance in the intended availability zone.
          Confirm boot, network access, user-data handling, and guest login.
        </li>
        <li>
          Publish or share the image only after validation. Replace an image
          with a new version when the operating system needs security updates.
        </li>
      </ol>

      <h3>Operating system examples</h3>
      <p>
        Each command assumes that the named file has already been obtained from
        an approved source and verified. Filenames are examples. Replace the
        release number, format, architecture, and login property with the actual
        values for your build. Releases in these examples illustrate the
        workflow; use a maintained version supported by your organization.
        Administrative permission may be needed to upload or publish images.
      </p>
      {imageExamples.map((example) => (
        <section key={example.id} id={`image-${example.id}`}>
          <h3>{example.title}</h3>
          <p>{example.description}</p>
          {example.id === 'coreos' && (
            <CodeBlock>{`xz -d ./fedora-coreos-openstack.qcow2.xz
qemu-img info ./fedora-coreos-openstack.qcow2`}</CodeBlock>
          )}
          <CodeBlock>{imageCreateCommand(example)}</CodeBlock>
          {example.id === 'coreos' && (
            <>
              <p>
                Some Magnum cluster drivers require a specific{' '}
                <code>os_distro</code> value such as <code>fedora-coreos</code>.
                Confirm that requirement with the cluster operator. The property
                is case sensitive; apply it before creating a cluster template
                that uses this image.
              </p>
              <CodeBlock>{`openstack image set "Fedora CoreOS" \\
  --property os_distro=fedora-coreos
openstack image show "Fedora CoreOS"`}</CodeBlock>
            </>
          )}
        </section>
      ))}

      <section id="image-windows">
        <h3>Windows</h3>
        <p>
          Prepare a licensed Windows guest with the drivers required by the
          hypervisor, Cloudbase-Init for instance initialization, and a
          supported method for retrieving or setting the Administrator password.
          Generalize the guest with Sysprep, shut it down, and capture the disk
          only after that final shutdown. Verify whether the resulting file is
          QCOW2 or RAW and declare the matching format. Check firmware mode and
          licensing before distributing the image. If the captured disk is RAW,
          convert it to QCOW2 before using the following upload command. Choose
          minimum disk and RAM values that meet the actual Windows build&apos;s
          requirements; the values below are illustrative.
        </p>
        <CodeBlock>{`qemu-img convert -p -f raw -O qcow2 \\
  ./windows-server.raw ./windows-server.qcow2
qemu-img info ./windows-server.qcow2
openstack image create "Windows Server" \\
  --file ./windows-server.qcow2 \\
  --disk-format qcow2 --container-format bare --private \\
  --min-disk 50 --min-ram 2048 \\
  --property os_type=windows \\
  --property os_distro=windows \\
  --property os_version=2022 \\
  --property os_admin_user=Administrator
openstack image show "Windows Server"`}</CodeBlock>
      </section>

      <h3>Troubleshooting</h3>
      <ul>
        <li>
          If upload fails, verify quota, permissions, file size, network
          stability, and whether the disk format matches the file content.
        </li>
        <li>
          If the image remains queued or saving, inspect the Glance service
          status and storage backend.
        </li>
        <li>
          If an instance will not boot, compare image architecture and firmware
          with the flavor and compute hosts; inspect console output and compute
          logs.
        </li>
        <li>
          If login fails, verify the guest&apos;s actual account, SSH key or
          password initialization, security group, and cloud-init or
          Cloudbase-Init logs.
        </li>
      </ul>
    </article>
  );
}
