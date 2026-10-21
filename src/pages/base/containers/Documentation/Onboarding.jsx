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
openstack --os-cloud CLOUD security group rule delete RULE_ID
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
        <h2>Check and remove connections</h2>
        <p>
          If an instance cannot reach outside its subnet, inspect its subnet
          gateway, router interfaces, router external gateway, security groups,
          and the guest operating system&apos;s routes. To delete a router,
          first remove attached subnet interfaces and its external gateway.
        </p>
        <pre>
          <code>{`openstack --os-cloud CLOUD router remove subnet project-router private-subnet
openstack --os-cloud CLOUD router unset --external-gateway project-router
openstack --os-cloud CLOUD router delete project-router`}</code>
        </pre>
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
openstack --os-cloud CLOUD object create app-files ./report.pdf
openstack --os-cloud CLOUD object list app-files
openstack --os-cloud CLOUD object save --file ./report-copy.pdf app-files report.pdf`}</code>
        </pre>
        <p>
          Keep containers private unless public read access is intentional.
          Download a sample object after uploading to verify that clients have
          access and that file contents are intact.
        </p>
        <h2>Cleanup</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD object delete app-files report.pdf
openstack --os-cloud CLOUD container delete app-files`}</code>
        </pre>
        <p>
          Delete objects before deleting the container. A failed delete commonly
          means objects remain or your token lacks permission.
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
swift upload app-files ./report.pdf
swift list app-files
swift download app-files report.pdf`}</code>
        </pre>
        <h2>Metadata and expiration</h2>
        <p>
          Swift can store metadata on a container or object. Object expiration
          is commonly set with <code>X-Delete-After</code> for a number of
          seconds or <code>X-Delete-At</code> for an epoch time. Verify the
          resulting headers before depending on automatic cleanup.
        </p>
        <pre>
          <code>{`swift post app-files report.pdf -H "X-Delete-After:86400"
swift stat app-files report.pdf`}</code>
        </pre>
        <p>
          Do not make a container public merely to test a download. Public read
          access can expose every object inside it.
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
          <code>{`openstack --os-cloud CLOUD ec2 credentials create
aws configure --profile sovereign-object`}</code>
        </pre>
        <h2>Validate the endpoint</h2>
        <pre>
          <code>{`aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3api list-buckets
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3api create-bucket --bucket app-archive
aws --profile sovereign-object --endpoint-url S3_ENDPOINT s3 cp ./report.pdf s3://app-archive/report.pdf`}</code>
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
openstack --os-cloud CLOUD server image create --name app-01-checkpoint app-01
openstack --os-cloud CLOUD image show app-01-checkpoint
openstack --os-cloud CLOUD server start app-01`}</code>
        </pre>
        <p>
          Wait until the image status is <code>active</code>. A volume-backed
          server may need separate volume snapshots to protect all of its data;
          check the boot source and attached volumes.
        </p>
        <h2>Volume snapshot</h2>
        <pre>
          <code>{`openstack --os-cloud CLOUD volume snapshot create --volume data-01 data-01-checkpoint
openstack --os-cloud CLOUD volume snapshot show data-01-checkpoint`}</code>
        </pre>
        <p>
          To move an image between clouds, export and import it only if policy
          permits and verify its actual disk format before upload. Test a
          restore before treating a snapshot as a recovery plan.
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
openstack --os-cloud CLOUD loadbalancer listener create --name app-http --protocol HTTP --protocol-port 80 app-lb
openstack --os-cloud CLOUD loadbalancer pool create --name app-pool --protocol HTTP --lb-algorithm ROUND_ROBIN --listener app-http
openstack --os-cloud CLOUD loadbalancer member create --subnet-id PRIVATE_SUBNET --address BACKEND_IP --protocol-port 8080 app-pool
openstack --os-cloud CLOUD loadbalancer show app-lb`}</code>
        </pre>
        <p>
          Add a health monitor for the application&apos;s real readiness
          endpoint. If the service is public, plan a floating IP or external VIP
          according to your cloud&apos;s network design. Wait for provisioning
          status <code>ACTIVE</code> between dependent changes.
        </p>
        <h2>Cleanup</h2>
        <p>
          Remove listeners, pools, and members in dependency order, or use
          cascading deletion if your deployment supports it. Inspect the
          associated VIP port and floating IP before releasing them.
        </p>
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
        <p>
          Delete dependent servers, ports, and router interfaces before removing
          a subnet or network.
        </p>
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
