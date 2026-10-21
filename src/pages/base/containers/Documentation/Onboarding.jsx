import React from 'react';
import DocLink from './DocLink';

// Original console guidance covering the Cloud Onboarding topics. Commands use
// CLOUD as the name of an authenticated entry in the user's clouds.yaml file.
export const onboardingTopics = [
  {
    slug: 'welcome',
    title: 'Cloud Onboarding',
    summary: 'A practical path from first sign-in to a running workload.',
    content: (
      <>
        <h2>Start with your project</h2>
        <p>
          An OpenStack project is the boundary for your servers, networks,
          volumes, and quotas. Confirm the active project and region in the
          console before creating resources. A user may have access to more than
          one project, and the same resource name can exist in each.
        </p>
        <h2>Recommended order</h2>
        <ol>
          <li>
            Check your project quota and the available images and flavors.
          </li>
          <li>Create a private network, subnet, and router if none exist.</li>
          <li>
            Register an SSH public key and create a restricted security group.
          </li>
          <li>Launch a server and verify its fixed IP and status.</li>
          <li>
            Allocate a floating IP only if the workload needs external access.
          </li>
          <li>
            Add persistent volumes, backups, metrics, or a load balancer as
            needed.
          </li>
        </ol>
        <p>
          This documentation is available inside the console. Start with the{' '}
          <DocLink slug="install-cli">CLI installation guide</DocLink> if you
          want to work from a terminal.
        </p>
      </>
    ),
  },
  {
    slug: 'install-cli',
    title: 'Install the OpenStack CLI',
    summary: 'Install command-line tools in an isolated Python environment.',
    content: (
      <>
        <h2>Install with Python</h2>
        <p>
          The Python OpenStack client gives you one <code>openstack</code>
          command for common identity, compute, network, image, and storage
          tasks. Use a virtual environment so the client does not change your
          system Python packages.
        </p>
        <h3>Linux and macOS</h3>
        <pre>
          <code>{`python3 -m venv ~/.venvs/openstack
source ~/.venvs/openstack/bin/activate
python -m pip install --upgrade pip python-openstackclient
openstack --version`}</code>
        </pre>
        <h3>Windows PowerShell</h3>
        <pre>
          <code>{`py -m venv .venv
.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip python-openstackclient
openstack --version`}</code>
        </pre>
        <p>
          Your operating system may also provide a packaged client. Package
          versions can lag behind the cloud API, so check the installed version
          if a command or option is missing. Object storage and load-balancer
          operations may need the corresponding client plugin.
        </p>
        <h3>Distribution packages</h3>
        <p>
          If you prefer the operating system package manager, install the
          package for your platform. The exact package name and available
          version depend on the distribution.
        </p>
        <pre>
          <code>{`# Ubuntu or Debian
sudo apt install python3-openstackclient
# Fedora or Enterprise Linux
sudo dnf install python3-openstackclient
# macOS with Homebrew
brew install openstackclient`}</code>
        </pre>
        <h2>Next step</h2>
        <p>
          Obtain your cloud-specific <code>clouds.yaml</code> or application
          credential from the cloud operator, protect it as a secret, and follow{' '}
          <DocLink slug="getting-started">Getting Started</DocLink>.
        </p>
      </>
    ),
  },
  {
    slug: 'getting-started',
    title: 'OpenStack CLI Getting Started',
    summary: 'Select a cloud, authenticate, and inspect your project.',
    content: (
      <>
        <h2>Credentials and scope</h2>
        <p>
          Ask your operator for the Keystone authentication URL, username or
          application credential, domain, project, and region. An unscoped
          identity identifies you; a project-scoped token authorizes work in one
          project. A supplied <code>clouds.yaml</code> profile normally holds
          the necessary scope so commands can use one cloud name.
        </p>
        <p>
          Keep credential files outside source control and restrict file
          permissions. Do not paste passwords into commands that will be saved
          in shell history. The examples below assume a configured profile named{' '}
          <code>CLOUD</code>.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD token issue
openstack --os-cloud CLOUD project list
openstack --os-cloud CLOUD region list
openstack --os-cloud CLOUD flavor list`}</code>
        </pre>
        <h2>Unscoped and project-scoped access</h2>
        <p>
          If you do not know which project to use, an operator can provide an
          unscoped cloud profile so you can list the projects assigned to your
          identity. Select one project in your normal profile, then issue a
          scoped token. Do not place a token or password in a shared terminal
          transcript.
        </p>
        <pre>
          <code>{`openstack --os-cloud UNSCOPED project list
openstack --os-cloud CLOUD token issue
openstack --os-cloud CLOUD catalog list`}</code>
        </pre>
        <p>
          <code>UNSCOPED</code> and <code>CLOUD</code> are separate profiles
          supplied by the cloud operator. The scoped profile includes the
          project and project domain; its token controls later resource
          commands. In a federated environment, the authentication flow may
          differ from password-based examples.
        </p>
        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>Unauthorized:</strong> check the authentication URL and
            credentials.
          </li>
          <li>
            <strong>Forbidden:</strong> check project scope and assigned roles.
          </li>
          <li>
            <strong>Endpoint not found:</strong> check the region and service
            catalog.
          </li>
          <li>
            <strong>Empty list:</strong> confirm the active project before
            creating a duplicate resource.
          </li>
        </ul>
        <p>
          Use <code>openstack help &lt;command&gt;</code> to see options
          supported by your installed client. Service availability varies by
          cloud.
        </p>
      </>
    ),
  },
  {
    slug: 'security-groups',
    title: 'Security Groups',
    summary: 'Control traffic to server network ports with explicit rules.',
    content: (
      <>
        <h2>How rules work</h2>
        <p>
          Security groups are stateful network filters attached to instance
          ports. A rule defines direction, protocol, port range, and a remote
          CIDR or security group. Allow only the traffic the workload needs; the
          default group is often broader or narrower than expected.
        </p>
        <h2>Create a group and inspect its rules</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD security group create web --description "Web traffic"
openstack --os-cloud CLOUD security group rule create --ingress --protocol tcp --dst-port 443 --remote-ip 0.0.0.0/0 web
openstack --os-cloud CLOUD security group rule list web`}</code>
        </pre>
        <h3>Common ingress rules</h3>
        <p>
          Add HTTP only if the service accepts unencrypted traffic. Use an ICMP
          rule for diagnostics, a UDP rule for a service such as DNS, or a
          remote group when only ports attached to that group should connect.
          The groups in these examples must already exist.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD security group rule create --ingress --protocol tcp --dst-port 80 --remote-ip 0.0.0.0/0 web
openstack --os-cloud CLOUD security group rule create --ingress --protocol icmp --remote-ip 192.0.2.0/24 web
openstack --os-cloud CLOUD security group rule create --ingress --protocol udp --dst-port 53 --remote-group dns-clients dns-servers
openstack --os-cloud CLOUD security group rule create --ingress --protocol tcp --dst-port 3389 --remote-group admin-clients windows`}</code>
        </pre>
        <p>
          For administration, restrict SSH to your office or VPN CIDR rather
          than the whole internet. Use a separate rule for IPv6 if the network
          has IPv6 addresses.
        </p>
        <pre>
          <code>
            openstack --os-cloud CLOUD security group rule create --ingress
            --protocol tcp --dst-port 22 --remote-ip 192.0.2.0/24 web
          </code>
        </pre>
        <h2>Attach and remove</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server add security group SERVER web
openstack --os-cloud CLOUD security group rule show RULE_ID
openstack --os-cloud CLOUD security group rule delete RULE_ID
openstack --os-cloud CLOUD server remove security group SERVER web
openstack --os-cloud CLOUD security group delete web`}</code>
        </pre>
        <p>
          Removing a group requires detaching it from any ports that still use
          it. A floating IP alone does not bypass security group rules.
        </p>
      </>
    ),
  },
  {
    slug: 'floating-ips',
    title: 'Floating IPs',
    summary:
      'Expose a private server through an address on an external network.',
    content: (
      <>
        <h2>Before you allocate</h2>
        <p>
          A floating IP maps an external address to a fixed IP on a server port.
          The private subnet needs a router with an external gateway, and the
          security group must allow the application traffic. An unassociated
          address can still count against quota.
        </p>
        <h2>Allocate and associate</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD network list --external
openstack --os-cloud CLOUD floating ip create PUBLIC_NETWORK
openstack --os-cloud CLOUD floating ip list
openstack --os-cloud CLOUD server add floating ip SERVER FLOATING_IP`}</code>
        </pre>
        <p>
          Confirm that the server has the expected private port and that the
          floating IP status is active. If the server has several ports,
          associate the address with the intended port and fixed IP.
        </p>
        <h2>Associate with a specific port</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD port list --server SERVER
openstack --os-cloud CLOUD floating ip set --port PORT_ID --fixed-ip-address FIXED_IP FLOATING_IP
openstack --os-cloud CLOUD floating ip show FLOATING_IP
openstack --os-cloud CLOUD floating ip unset --port FLOATING_IP`}</code>
        </pre>
        <p>
          Use <code>--fixed-ip-address</code> when the port owns multiple fixed
          addresses. Unsetting the port leaves the public address allocated to
          the project.
        </p>
        <h2>Advanced: shared private VIP</h2>
        <p>
          Prefer a managed load balancer for a normal web service. A shared
          virtual IP is useful when two network appliances manage failover
          inside their guest operating systems. Reserve one private VIP on the
          subnet, map a floating IP to that reservation, and allow both server
          ports to use the VIP. The Neutron backend must support this design;
          OVN deployments may require a single IP address rather than a CIDR in
          each allowed-address pair.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD port create --network PRIVATE_NETWORK --fixed-ip subnet=PRIVATE_SUBNET,ip-address=PRIVATE_VIP vip-reservation
openstack --os-cloud CLOUD floating ip create --port vip-reservation PUBLIC_NETWORK
openstack --os-cloud CLOUD port set --allowed-address ip-address=PRIVATE_VIP SERVER_PORT_A
openstack --os-cloud CLOUD port set --allowed-address ip-address=PRIVATE_VIP SERVER_PORT_B`}</code>
        </pre>
        <p>
          Configure the VIP and failover software on the guest servers, then
          test traffic while each server owns the address. The guest uses the
          private VIP; the floating IP is translated at the network edge.
        </p>
        <h2>Release</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server remove floating ip SERVER FLOATING_IP
openstack --os-cloud CLOUD floating ip delete FLOATING_IP`}</code>
        </pre>
        <p>
          Disassociation preserves the allocation; deletion releases it back to
          the external pool. Check DNS records and client dependencies before
          releasing a production address.
        </p>
      </>
    ),
  },
  {
    slug: 'key-pairs',
    title: 'SSH Key Pairs',
    summary: 'Register a public key for first login to Linux instances.',
    content: (
      <>
        <h2>Import a key you already control</h2>
        <p>
          OpenStack stores the public key and injects it into a compatible image
          during provisioning. Keep the private key on your own device; never
          upload it to the console or commit it to a repository.
        </p>
        <pre>
          <code>{`ssh-keygen -t ed25519 -f ~/.ssh/cloud-admin -C "cloud-admin"
openstack --os-cloud CLOUD keypair create --public-key ~/.ssh/cloud-admin.pub cloud-admin
openstack --os-cloud CLOUD keypair list
openstack --os-cloud CLOUD keypair show cloud-admin`}</code>
        </pre>
        <h2>Generate a key through OpenStack</h2>
        <p>
          Alternatively, ask the client to generate a key and write the private
          part to a local file. Restrict that file to your user before using it
          for SSH. Client support for key algorithms can differ by release.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD keypair create --private-key ./cloud-generated.pem cloud-generated
chmod 600 ./cloud-generated.pem
openstack --os-cloud CLOUD keypair show cloud-generated --public-key`}</code>
        </pre>
        <h2>Use the key when creating a server</h2>
        <p>
          Choose <code>cloud-admin</code> as the key pair at launch. The image
          must support key injection, usually through cloud-init. The login
          username depends on the image; for example, many Ubuntu cloud images
          use <code>ubuntu</code>. Confirm it with the image owner.
        </p>
        <p>
          Removing a key pair from OpenStack does not revoke a public key
          already present inside a server. Rotate access inside the guest
          operating system if a private key is lost or compromised.
        </p>
      </>
    ),
  },
  {
    slug: 'servers',
    title: 'Servers',
    summary: 'Launch, inspect, and manage compute instances.',
    content: (
      <>
        <h2>Choose the launch inputs</h2>
        <ul>
          <li>
            An image provides the operating system; a flavor sets vCPUs, RAM,
            and disk.
          </li>
          <li>
            A network supplies the fixed IP; a key pair enables guest login.
          </li>
          <li>A security group permits only the required traffic.</li>
          <li>
            A boot volume preserves the root disk independently of the server
            lifecycle when configured to do so.
          </li>
        </ul>
        <pre>
          <code>{`openstack --os-cloud CLOUD image list
openstack --os-cloud CLOUD flavor list
openstack --os-cloud CLOUD network list
openstack --os-cloud CLOUD server create --image IMAGE --flavor FLAVOR --network NETWORK --key-name cloud-admin --security-group web --wait app-01`}</code>
        </pre>
        <h2>Check status and access</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server list
openstack --os-cloud CLOUD server show app-01
openstack --os-cloud CLOUD console log show app-01`}</code>
        </pre>
        <p>
          A server should reach <code>ACTIVE</code> before you troubleshoot
          application access. Inspect its fixed IP, security group, route, and
          cloud-init log. For first-boot automation, provide a user-data file
          with <code>--user-data FILE</code>. A config drive can expose metadata
          when the network metadata service is unavailable.
        </p>
        <h2>Automate first boot</h2>
        <p>
          Save cloud-init instructions in a local file, then pass that file at
          server creation. The image must include cloud-init for these
          instructions to run. A config drive presents metadata locally when the
          instance cannot reach the network metadata service.
        </p>
        <pre>
          <code>{`#cloud-config
packages:
  - nginx
runcmd:
  - systemctl enable --now nginx`}</code>
        </pre>
        <pre>
          <code>
            openstack --os-cloud CLOUD server create --image IMAGE --flavor
            FLAVOR --network NETWORK --key-name cloud-admin --user-data
            ./user-data.yaml --use-config-drive --property role=web --wait
            app-web
          </code>
        </pre>
        <h2>Launch from existing storage</h2>
        <p>
          An instance snapshot that appears in Glance is selected as an image.
          For a Cinder volume snapshot, first create a bootable volume from the
          snapshot and launch with <code>--volume</code>. Confirm the snapshot
          contains a bootable operating system.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD server create --image app-01-checkpoint --flavor FLAVOR --network NETWORK --wait app-restored
openstack --os-cloud CLOUD volume create --snapshot BOOT_VOLUME_SNAPSHOT restored-boot
openstack --os-cloud CLOUD server create --volume restored-boot --flavor FLAVOR --network NETWORK --wait app-from-volume`}</code>
        </pre>
        <h2>Lifecycle</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server stop app-01
openstack --os-cloud CLOUD server start app-01
openstack --os-cloud CLOUD server delete app-01`}</code>
        </pre>
        <p>
          Deletion may also delete attached boot storage depending on the
          volume&apos;s delete-on-termination setting. Review backups and
          attachments first.
        </p>
      </>
    ),
  },
  {
    slug: 'routers',
    title: 'Routers',
    summary: 'Connect project subnets and provide an external gateway.',
    content: (
      <>
        <h2>Connect a private subnet</h2>
        <p>
          A Neutron router provides layer-3 connectivity between its attached
          subnets. An external gateway can provide outbound NAT and a path for
          floating IP traffic. Confirm that your project is allowed to use the
          chosen external network.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD router create project-router
openstack --os-cloud CLOUD router add subnet project-router private-subnet
openstack --os-cloud CLOUD router set --external-gateway PUBLIC_NETWORK project-router
openstack --os-cloud CLOUD router show project-router`}</code>
        </pre>
        <h2>Inspect and update a router</h2>
        <p>
          List and describe the router after attaching a subnet. Use an extra
          static route only when a reachable next hop exists on a connected
          network.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD router list
openstack --os-cloud CLOUD router set --description "Project egress" project-router
openstack --os-cloud CLOUD router add route --route destination=10.30.0.0/24,gateway=10.20.0.254 project-router
openstack --os-cloud CLOUD router show project-router`}</code>
        </pre>
        <p>
          As an alternative to <code>router add subnet</code>, attach a
          dedicated port. Use this form only when designing the router from the
          start; do not attach both methods to the same subnet.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD port create --network private-net --fixed-ip subnet=private-subnet router-port
openstack --os-cloud CLOUD router add port project-router router-port`}</code>
        </pre>
        <h2>Check and remove connections</h2>
        <p>
          If an instance cannot reach outside its subnet, inspect its subnet
          gateway, router interfaces, router external gateway, security groups,
          and the guest operating system&apos;s routes. To delete a router,
          first remove attached subnet interfaces and its external gateway.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD router remove route --route destination=10.30.0.0/24,gateway=10.20.0.254 project-router
openstack --os-cloud CLOUD router remove subnet project-router private-subnet
openstack --os-cloud CLOUD router unset --external-gateway project-router
openstack --os-cloud CLOUD router delete project-router`}</code>
        </pre>
        <p>
          If you attached a port instead of the subnet, remove the port with{' '}
          <code>openstack router remove port project-router router-port</code>{' '}
          before clearing the gateway. A busy router cannot be deleted while
          interfaces or gateway ports remain.
        </p>
      </>
    ),
  },
  {
    slug: 'onboarding-images',
    title: 'Images',
    summary: 'Select or upload boot images for servers and volumes.',
    content: (
      <>
        <h2>Select an image</h2>
        <p>
          An image is a reusable boot artifact. Check its operating system,
          architecture, disk format, minimum RAM and disk requirements,
          visibility, and whether it supports cloud-init before launch. Prefer a
          maintained image from a trusted publisher.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD image list
openstack --os-cloud CLOUD image show IMAGE`}</code>
        </pre>
        <h2>Upload a private image</h2>
        <p>
          Upload only a disk file whose format you know. The format declared to
          Glance must match the actual file. A large upload can take time; wait
          for the image to become <code>active</code> before launching a server.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD image create --private --disk-format qcow2 --container-format bare --file ./server.qcow2 app-image
openstack --os-cloud CLOUD image show app-image`}</code>
        </pre>
        <h2>Launch, export, and remove</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server create --image app-image --flavor FLAVOR --network NETWORK --wait image-test
openstack --os-cloud CLOUD image save --file ./app-image.qcow2 app-image
openstack --os-cloud CLOUD image delete app-image`}</code>
        </pre>
        <p>
          Export may be restricted by image policy. Deleting an image does not
          delete existing servers, but it prevents new launches from that image.
          Verify the exported file before importing it elsewhere.
        </p>
        <p>
          Images differ from instance and volume snapshots. See the{' '}
          <DocLink slug="images">image and Glance guide</DocLink> for additional
          format and compatibility details.
        </p>
      </>
    ),
  },
  {
    slug: 'metrics',
    title: 'Metrics',
    summary: 'Find resource measurements and understand telemetry retention.',
    content: (
      <>
        <h2>Inspect telemetry</h2>
        <p>
          When Gnocchi is enabled, metrics contain time-series measures and
          resources connect those metrics to instances, volumes, and other
          OpenStack objects. Not every deployment exposes the metrics API or
          collects the same measurements.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD metric resource list
openstack --os-cloud CLOUD metric resource show RESOURCE_ID
openstack --os-cloud CLOUD metric list
openstack --os-cloud CLOUD metric measures show METRIC_ID`}</code>
        </pre>
        <h2>Create and manage a metric</h2>
        <p>
          Most resource metrics are created automatically by the telemetry
          service. If your role permits custom metrics, select an existing
          archive policy and associate a metric with a resource. Destructive
          commands below are for resources you own, not platform-managed
          telemetry. For the sample measure, replace <code>TIMESTAMP_UTC</code>{' '}
          with a recent ISO 8601 UTC timestamp within the policy retention
          window.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD metric archive-policy list
openstack --os-cloud CLOUD metric create request_count --resource-id RESOURCE_ID --archive-policy-name POLICY --unit requests
openstack --os-cloud CLOUD metric show request_count --resource-id RESOURCE_ID
openstack --os-cloud CLOUD metric measures add --resource-id RESOURCE_ID --measure TIMESTAMP_UTC@1 request_count
openstack --os-cloud CLOUD metric measures show request_count --resource-id RESOURCE_ID
openstack --os-cloud CLOUD metric delete --resource-id RESOURCE_ID request_count`}</code>
        </pre>
        <h2>Resource records and types</h2>
        <p>
          Gnocchi resources provide identity and attributes for metrics.
          Operators may define resource types; application users normally
          inspect and update only records they own. Creating or deleting a
          resource record can remove its associated time series. Replace{' '}
          <code>RESOURCE_UUID</code> with a new UUID for a test resource.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD metric resource-type list
openstack --os-cloud CLOUD metric resource-type show generic
openstack --os-cloud CLOUD metric resource-type create --attribute display_name:string:false app-resource
openstack --os-cloud CLOUD metric resource-type update --attribute owner:string:false app-resource
openstack --os-cloud CLOUD metric resource create --type app-resource --attribute display_name:app-01 RESOURCE_UUID
openstack --os-cloud CLOUD metric resource update --type app-resource --attribute display_name:app-02 RESOURCE_UUID
openstack --os-cloud CLOUD metric resource show RESOURCE_UUID
openstack --os-cloud CLOUD metric resource delete RESOURCE_UUID
openstack --os-cloud CLOUD metric resource-type delete app-resource`}</code>
        </pre>
        <h2>Archive policies</h2>
        <p>
          A policy defines how many points are kept and their granularity.
          Review an existing policy before creating a new one. Policy and
          resource-type administration may require an elevated role; check
          retention and storage cost with your operator. An archive policy can
          be deleted only when no metrics use it.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD metric archive-policy list
openstack --os-cloud CLOUD metric archive-policy show POLICY
openstack --os-cloud CLOUD metric archive-policy create --definition granularity:60s,points:1440 app-one-day
openstack --os-cloud CLOUD metric archive-policy update --definition granularity:60s,points:2880 app-one-day
openstack --os-cloud CLOUD metric archive-policy show app-one-day
openstack --os-cloud CLOUD metric archive-policy delete app-one-day`}</code>
        </pre>
        <h2>Read results carefully</h2>
        <p>
          An archive policy controls granularity, aggregation, and retention. A
          missing series may mean that collection is disabled, the resource was
          created recently, or the requested time range is outside retention.
          Compare timestamps and units before using a measure for capacity
          decisions.
        </p>
        <p>
          If <code>openstack metric</code> is unavailable, ask the cloud
          operator whether the Gnocchi client plugin and service endpoint are
          enabled for your project.
        </p>
      </>
    ),
  },
  {
    slug: 'object-store-openstack-cli',
    title: 'Object Storage with the OpenStack CLI',
    summary: 'Create containers and upload, download, or remove objects.',
    content: (
      <>
        <h2>Containers and objects</h2>
        <p>
          Swift stores objects inside containers. An object has a name and
          bytes; a slash in its name is a prefix, not a real directory. Use
          object storage for files, archives, and application assets, not as a
          block device mounted by a server.
        </p>
        <h2>Basic operations</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD container create app-files
openstack --os-cloud CLOUD container show app-files
openstack --os-cloud CLOUD object create --name report.pdf app-files ./report.pdf
openstack --os-cloud CLOUD object list app-files
openstack --os-cloud CLOUD object save --file ./report-copy.pdf app-files report.pdf`}</code>
        </pre>
        <h2>Bulk files, prefixes, and metadata</h2>
        <p>
          Set each object name explicitly when uploading from a local path. A
          slash in the object name creates a prefix, not a separate directory.
          This CLI lists all objects in the container; the Swift CLI can filter
          by prefix when the container is large.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD container list
openstack --os-cloud CLOUD object create --name reports/january.csv app-files ./reports/january.csv
openstack --os-cloud CLOUD object create --name reports/february.csv app-files ./reports/february.csv
openstack --os-cloud CLOUD object list app-files
openstack --os-cloud CLOUD object set --property owner=finance app-files reports/january.csv
openstack --os-cloud CLOUD object show app-files reports/january.csv
openstack --os-cloud CLOUD object unset --property owner app-files reports/january.csv`}</code>
        </pre>
        <p>
          Keep containers private unless public read access is intentional.
          Download a sample object after uploading to verify that clients have
          access and that file contents are intact.
        </p>
        <p>
          If public distribution is required and approved for the entire
          container, create it with <code>--public</code>. An existing private
          container should remain private while you test access. Use the Swift
          client for object expiration controls.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD container create --public public-assets
openstack --os-cloud CLOUD container show public-assets`}</code>
        </pre>
        <h2>Cleanup</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD object delete app-files report.pdf reports/january.csv reports/february.csv
openstack --os-cloud CLOUD container delete app-files
openstack --os-cloud CLOUD container delete public-assets`}</code>
        </pre>
        <p>
          Delete objects before deleting the container. A failed delete commonly
          means objects remain or your token lacks permission. The optional{' '}
          <code>--recursive</code> flag deletes every object in the container as
          well as the container, so verify the target before using it.
        </p>
      </>
    ),
  },
  {
    slug: 'object-store-swift-cli',
    title: 'Object Storage with the Swift CLI',
    summary: 'Use the Swift-specific client for uploads and object metadata.',
    content: (
      <>
        <h2>Use a scoped OpenStack environment</h2>
        <p>
          Install <code>python-swiftclient</code> when you need Swift-specific
          operations. The client needs authentication variables or a supported
          cloud configuration. Run <code>swift stat</code> first to confirm that
          it can reach the correct project account.
        </p>
        <pre>
          <code>{`python -m pip install python-swiftclient
swift stat
swift post app-files
swift upload app-files report.pdf
swift list app-files
swift download app-files report.pdf --output ./report-copy.pdf`}</code>
        </pre>
        <h2>Directories and prefixes</h2>
        <pre>
          <code>{`swift upload app-files reports/
swift list app-files --prefix reports/
swift download app-files --prefix reports/ --output-dir ./downloaded
swift stat app-files report.pdf
swift stat app-files reports/january.csv`}</code>
        </pre>
        <p>
          The directory name becomes part of each object key. Confirm a prefix
          selection before bulk download or deletion. The{' '}
          <code>swift delete CONTAINER</code> form can remove the container and
          its contents; use it only after checking the object list.
        </p>
        <h2>Metadata and expiration</h2>
        <p>
          Swift can store metadata on a container or object. Object expiration
          is commonly set with <code>X-Delete-After</code> for a number of
          seconds or <code>X-Delete-At</code> for an epoch time. Verify the
          resulting headers before depending on automatic cleanup.
        </p>
        <pre>
          <code>{`swift post app-files report.pdf -H "X-Delete-After:86400"
swift post app-files report.pdf -H "X-Delete-At:UNIX_EPOCH_SECONDS"
swift post app-files report.pdf -H "X-Remove-Delete-At:"
swift stat app-files report.pdf`}</code>
        </pre>
        <p>
          Use either a relative number of seconds or an absolute Unix epoch time
          for one object. The <code>X-Remove-Delete-At</code> header clears a
          scheduled expiration. Run these commands as alternatives, not as a
          single sequence. Metadata behavior may depend on the Swift proxy
          configuration; inspect the object after each change.
        </p>
        <p>
          Do not make a container public merely to test a download. Public read
          access can expose every object inside it.
        </p>
        <h2>Cleanup</h2>
        <pre>
          <code>{`swift delete app-files report.pdf reports/january.csv reports/february.csv
swift delete app-files`}</code>
        </pre>
        <p>
          List the container before deleting it. A container-only delete can
          remove any remaining objects, including ones not shown in these
          examples.
        </p>
      </>
    ),
  },
  {
    slug: 'object-store-s3-cli',
    title: 'Object Storage with an S3 Client',
    summary: 'Use the S3-compatible API when your cloud provides it.',
    content: (
      <>
        <h2>Collect the endpoint and credentials</h2>
        <p>
          Some Swift deployments expose an S3-compatible API in addition to the
          native Swift API. Ask your operator for the S3 endpoint, region, and
          supported signature version. If policy permits, create an EC2
          credential for your project and store its access key and secret in a
          protected CLI profile.
        </p>
        <pre>
          <code>{`python -m pip install awscli
openstack --os-cloud CLOUD ec2 credentials create
aws configure --profile sovereign-object`}</code>
        </pre>
        <p>
          The credential output includes an access key and secret. Copy them
          into the protected profile when prompted; never commit the profile or
          include these values in screenshots. In the profile, set the region
          supplied by the operator. The endpoint is passed explicitly in the
          commands below, so no provider-specific plugin is required.
        </p>
        <h2>Validate the endpoint</h2>
        <pre>
          <code>{`aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3api list-buckets
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3api create-bucket --bucket app-archive
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3 cp ./report.pdf s3://app-archive/report.pdf
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3 ls s3://app-archive/
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3 cp s3://app-archive/report.pdf ./downloaded-report.pdf`}</code>
        </pre>
        <p>
          Replace <code>S3_ENDPOINT</code> with the endpoint for your cloud; it
          is not necessarily the Keystone or native Swift URL. If signing fails,
          verify the configured region, signature version, and clock. A bucket
          may appear as a Swift container, but feature parity is provider
          dependent.
        </p>
      </>
    ),
  },
  {
    slug: 'object-store-skyline',
    title: 'Object Storage in the Console',
    summary: 'Manage containers and files using the graphical interface.',
    content: (
      <>
        <h2>Create a container</h2>
        <ol>
          <li>Open Storage, then Object Storage from the navigation menu.</li>
          <li>Select Create Container and enter a durable, unique name.</li>
          <li>
            Keep public access off unless the files are meant for everyone.
          </li>
          <li>Open the container to inspect its objects and properties.</li>
        </ol>
        <h2>Work with files</h2>
        <p>
          Use Upload File to add an object. The object name may include
          prefix-like path segments. Use the object&apos;s action menu to
          download or delete it, and confirm the operation has completed before
          leaving the page. Some console versions upload files only, not
          complete local directory trees.
        </p>
        <p>
          Container details show visibility and object counts. If your
          deployment supports changing visibility after creation, use the
          container Update action and confirm the access setting. A public
          container can expose every object it contains. Object expiration is
          generally configured with the Swift CLI rather than this view.
        </p>
        <p>
          Empty a container before deleting it. For bulk transfer, automatic
          expiration, or scripted operations, use the{' '}
          <DocLink slug="object-store-openstack-cli">OpenStack CLI</DocLink> or{' '}
          <DocLink slug="object-store-swift-cli">Swift CLI</DocLink>.
        </p>
      </>
    ),
  },
  {
    slug: 'object-store-tools',
    title: 'Object Storage SDKs and Tools',
    summary: 'Choose an API client for applications and bulk transfers.',
    content: (
      <>
        <h2>Pick the API your application needs</h2>
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Best fit</th>
              <th>Credential</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OpenStack SDK</td>
              <td>Python apps already using OpenStack</td>
              <td>Keystone-scoped cloud profile</td>
            </tr>
            <tr>
              <td>Swift client</td>
              <td>Native Swift features and metadata</td>
              <td>Keystone token or cloud profile</td>
            </tr>
            <tr>
              <td>S3 SDK or AWS CLI</td>
              <td>S3-compatible integrations</td>
              <td>EC2 access key and secret</td>
            </tr>
            <tr>
              <td>Rclone</td>
              <td>Bulk copy and synchronization</td>
              <td>Swift or S3 remote configuration</td>
            </tr>
          </tbody>
        </table>
        <h2>Validate before automating</h2>
        <ol>
          <li>Create a private test container or bucket.</li>
          <li>Upload a small file and compare its downloaded contents.</li>
          <li>Test listing, overwrite, and deletion permissions.</li>
          <li>
            Confirm endpoint, region, TLS, and retry behavior under a restricted
            account.
          </li>
        </ol>
        <p>
          Store secrets in your application&apos;s secret manager rather than in
          code or command arguments. S3 compatibility varies by provider; test
          the exact features your software uses, such as multipart uploads and
          signed URLs.
        </p>
        <h2>Python S3 SDK example</h2>
        <p>
          A compatible endpoint can be used with <code>boto3</code>. Inject
          endpoint and credentials through your application runtime rather than
          hard-coding them. The bucket must already exist or the caller must
          have permission to create it.
        </p>
        <pre>
          <code>{`import os
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ["S3_ENDPOINT"],
    region_name=os.environ["S3_REGION"],
    aws_access_key_id=os.environ["S3_ACCESS_KEY"],
    aws_secret_access_key=os.environ["S3_SECRET_KEY"],
)
s3.upload_file("report.pdf", "app-archive", "report.pdf")
print(s3.list_objects_v2(Bucket="app-archive", Prefix="report"))`}</code>
        </pre>
        <h2>Bulk synchronization</h2>
        <p>
          Rclone can synchronize a local directory with a Swift or S3-compatible
          remote. Configure the remote interactively, then test with a copy
          before using a mirror operation that can delete destination files.
        </p>
        <pre>
          <code>{`rclone config
rclone copy ./reports sovereign-object:app-archive/reports
rclone ls sovereign-object:app-archive/reports`}</code>
        </pre>
      </>
    ),
  },
  {
    slug: 'snapshots',
    title: 'Snapshots',
    summary: 'Capture a point-in-time image or volume state for recovery.',
    content: (
      <>
        <h2>Choose the right snapshot</h2>
        <p>
          An instance snapshot creates an image of a server. A volume snapshot
          captures a Cinder volume. Both can consume quota and storage, and
          neither replaces an application-aware backup. Flush writes or stop the
          workload when consistency matters.
        </p>
        <h2>Instance snapshot</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD server stop app-01
openstack --os-cloud CLOUD server image create --name app-01-checkpoint --wait app-01
openstack --os-cloud CLOUD image show app-01-checkpoint
openstack --os-cloud CLOUD server start app-01`}</code>
        </pre>
        <p>
          Wait until the image status is <code>active</code>. A volume-backed
          server may need separate volume snapshots to protect all of its data;
          check the boot source and attached volumes.
        </p>
        <h2>Inspect, export, and import an instance snapshot</h2>
        <p>
          The server snapshot is an image. Inspect its status and disk format
          before export. Image download may be disabled by policy. Copy the
          exported file to the destination cloud through an approved transfer
          method, then declare its actual format during import.
        </p>
        <pre>
          <code>{`openstack --os-cloud SOURCE image show app-01-checkpoint
openstack --os-cloud SOURCE image save --file ./app-01-checkpoint.img app-01-checkpoint
openstack --os-cloud DESTINATION image create --private --disk-format ACTUAL_FORMAT --container-format bare --file ./app-01-checkpoint.img app-01-restored
openstack --os-cloud DESTINATION image show app-01-restored
openstack --os-cloud DESTINATION server create --image app-01-restored --flavor FLAVOR --network NETWORK --wait restored-app`}</code>
        </pre>
        <p>
          <code>ACTUAL_FORMAT</code> must match the exported image metadata and
          bytes, for example <code>raw</code> or <code>qcow2</code>. Confirm the
          destination has suitable network, flavor, key, and security-group
          resources. Test application recovery after boot.
        </p>
        <h2>Volume snapshot</h2>
        <p>
          The example volume is attached to a server, so quiesce application
          writes before taking its snapshot. On older Block Storage API
          microversions, <code>--force</code> permits an attached volume to be
          snapshotted when the backend supports it. Confirm the snapshot reaches{' '}
          <code>available</code> before restoring it.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD volume snapshot create --force --volume data-01 data-01-checkpoint
openstack --os-cloud CLOUD volume snapshot show data-01-checkpoint
openstack --os-cloud CLOUD volume create --snapshot data-01-checkpoint restored-data`}</code>
        </pre>
        <p>
          The restored volume inherits the snapshot size when no size is
          supplied. If a larger size is requested, it must be at least as large
          as the source volume. Test a restore before treating a snapshot as a
          recovery plan.
        </p>
      </>
    ),
  },
  {
    slug: 'volumes',
    title: 'Volumes',
    summary: 'Create persistent block storage and attach it to servers.',
    content: (
      <>
        <h2>Persistent block storage</h2>
        <p>
          Cinder volumes provide block devices for server boot disks or
          application data. Choose the volume type, size, and availability zone
          supported by your cloud. Creating a volume does not format or mount it
          inside the guest operating system.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD volume type list
openstack --os-cloud CLOUD volume create --size 20 data-01
openstack --os-cloud CLOUD volume show data-01
openstack --os-cloud CLOUD server add volume app-01 data-01`}</code>
        </pre>
        <p>
          After attachment, identify the new device inside the guest, create a
          filesystem if needed, and mount it. Use a filesystem UUID in
          persistent mount configuration because device names can change.
          Unmount and flush writes before detaching a data volume.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD server volume list app-01
openstack --os-cloud CLOUD server remove volume app-01 data-01
openstack --os-cloud CLOUD volume show data-01`}</code>
        </pre>
        <h2>Boot from volume</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD volume create --image IMAGE --size 20 app-boot
openstack --os-cloud CLOUD server create --volume app-boot --flavor FLAVOR --network NETWORK --wait app-02`}</code>
        </pre>
        <p>
          Verify whether the boot volume will be deleted when the server is
          deleted. Snapshot or back up important data independently.
        </p>
      </>
    ),
  },
  {
    slug: 'load-balancers',
    title: 'Load Balancers',
    summary: 'Distribute traffic to healthy backend servers.',
    content: (
      <>
        <h2>Plan the traffic path</h2>
        <p>
          A load balancer has a virtual IP (VIP) on a subnet. A listener accepts
          client traffic, a pool selects backend members, and a health monitor
          checks whether members should receive requests. Confirm that your
          cloud offers Octavia and that backend security groups allow traffic
          from the load balancer.
        </p>
        <h2>Create and inspect</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD loadbalancer create --name app-lb --vip-subnet-id PRIVATE_SUBNET --wait
openstack --os-cloud CLOUD loadbalancer listener create --name app-http --protocol HTTP --protocol-port 80 --wait app-lb
openstack --os-cloud CLOUD loadbalancer pool create --name app-pool --protocol HTTP --lb-algorithm ROUND_ROBIN --listener app-http --wait
openstack --os-cloud CLOUD loadbalancer member create --subnet-id PRIVATE_SUBNET --address BACKEND_IP --protocol-port 8080 --wait app-pool
openstack --os-cloud CLOUD loadbalancer show app-lb`}</code>
        </pre>
        <p>
          Add a health monitor for the application&apos;s real readiness
          endpoint. If the service is public, plan a floating IP or external VIP
          according to your cloud&apos;s network design. Wait for provisioning
          status <code>ACTIVE</code> between dependent changes.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD loadbalancer healthmonitor create --name app-health --delay 5 --timeout 3 --max-retries 3 --type HTTP --url-path /health --wait app-pool
openstack --os-cloud CLOUD loadbalancer list
openstack --os-cloud CLOUD loadbalancer listener list
openstack --os-cloud CLOUD loadbalancer pool list
openstack --os-cloud CLOUD loadbalancer member list app-pool
openstack --os-cloud CLOUD loadbalancer healthmonitor show app-health`}</code>
        </pre>
        <h2>Update a service</h2>
        <p>
          Change one component at a time, then wait for the load balancer to
          return to <code>ACTIVE</code> before making another change. Adjust a
          listener limit or add another healthy backend as demand grows.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD loadbalancer listener set --connection-limit 100 --wait app-http
openstack --os-cloud CLOUD loadbalancer member create --subnet-id PRIVATE_SUBNET --address SECOND_BACKEND_IP --protocol-port 8080 --wait app-pool
openstack --os-cloud CLOUD loadbalancer show app-lb`}</code>
        </pre>
        <h2>Cleanup</h2>
        <p>
          Remove an individual member when retiring a backend. To delete the
          whole service, inspect the associated VIP port and floating IP,
          release a separately allocated floating IP, and use cascading deletion
          only if your deployment supports it. Cascading deletion removes the
          listener, pool, monitor, and members too.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD loadbalancer member delete --wait app-pool MEMBER_ID
openstack --os-cloud CLOUD loadbalancer delete --cascade --wait app-lb`}</code>
        </pre>
      </>
    ),
  },
  {
    slug: 'networks',
    title: 'Networks and Subnets',
    summary: 'Give workloads private addresses and a route to other networks.',
    content: (
      <>
        <h2>Create a project network</h2>
        <p>
          A network is a layer-2 segment. A subnet supplies an IP range,
          gateway, and often DHCP. Choose a CIDR that does not overlap with
          other networks your application must reach. A network alone does not
          provide external connectivity.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD network create private-net
openstack --os-cloud CLOUD subnet create --network private-net --subnet-range 10.20.0.0/24 --gateway 10.20.0.1 private-subnet
openstack --os-cloud CLOUD network show private-net
openstack --os-cloud CLOUD subnet show private-subnet`}</code>
        </pre>
        <h2>Connect and troubleshoot</h2>
        <p>
          Attach the subnet to a router if it needs to reach another network.
          Then launch a server on <code>private-net</code>. If address
          assignment fails, check DHCP, pool exhaustion, and subnet
          configuration. If traffic fails, check port state, security groups,
          routing, and the guest firewall.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD port list --network private-net
openstack --os-cloud CLOUD router add subnet project-router private-subnet`}</code>
        </pre>
        <h2>Inspect and update</h2>
        <p>
          List networks, subnets, and ports in the current project and region.
          Network descriptions can help distinguish workloads. Changing DHCP,
          gateway, or DNS settings on an active subnet can interrupt existing
          guests; review the impact before changing them.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD network list
openstack --os-cloud CLOUD subnet list --network private-net
openstack --os-cloud CLOUD port list --network private-net
openstack --os-cloud CLOUD network set --description "Private application network" private-net
openstack --os-cloud CLOUD network show private-net`}</code>
        </pre>
        <h2>Remove a network</h2>
        <p>
          Delete dependent servers, ports, and router interfaces before removing
          a subnet or network. These commands permanently remove the subnet and
          network after the application no longer needs them.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD router remove subnet project-router private-subnet
openstack --os-cloud CLOUD subnet delete private-subnet
openstack --os-cloud CLOUD network delete private-net`}</code>
        </pre>
      </>
    ),
  },
  {
    slug: 'quotas',
    title: 'Quotas',
    summary: 'Check project limits before provisioning new resources.',
    content: (
      <>
        <h2>Read limits and current use</h2>
        <p>
          OpenStack services enforce project quotas for resources such as
          instances, vCPUs, RAM, ports, floating IPs, volumes, snapshots, and
          gigabytes. The console overview may show both a limit and current
          utilization. Limits can differ by project and region.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD quota show
openstack --os-cloud CLOUD limits show --absolute`}</code>
        </pre>
        <p>
          An apparent capacity failure can be a quota failure even when
          infrastructure is healthy. Compare the requested resources with the
          remaining quota, then check whether unused allocations can be
          released. Some resources in error state still count toward limits.
        </p>
        <h2>Request an increase</h2>
        <p>
          Project administrators or cloud operators control quota changes.
          Provide the project, region, resource type, current limit, requested
          limit, and expected workload. Raising a quota changes the project
          allowance; it does not guarantee physical capacity.
        </p>
      </>
    ),
  },
];

export default onboardingTopics;
