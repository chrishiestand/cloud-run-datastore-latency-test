# Cloud Run -> Datastore Latency Test (service account auth)

This will runs an express http server and does a simple datastore `.get()` when the endpoint `/` is hit.

It then returns some details, including the timing. These are also printed to console/logged.

This accesses datastore via default service account authentication. You may need to either create a service account and give it datastore permissions, or use an existing service account with datastore permissions.

## Env Vars
Required:   
* KIND = kind of datastore entity (need not exist)
* ID = ID/name of datastore entity (need not exist)
* GCP_KEY = base 64 encoded .json service account key

Optional:   
* PROJECT_ID = The GCP Project ID where the datastore can be found, if different than cloud run's project
* NAMESPACE = The datastore namespace


## My Results
In my tests both Cloud Run and datastore were in region us-east1. I've ran this test where datastore and cloud run were in 2 separate projects, and when they were in the same project, with the same results.

The COLD START requests are **very** slow on the order of tens of seconds, e.g. ~30s. But subsequent `get()`s are reasonable on the order of tens of milliseconds, e.g. ~40ms;