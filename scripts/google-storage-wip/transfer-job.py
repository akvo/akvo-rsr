import json
import datetime
import time

# need: pip install google-api-python-client
import googleapiclient.discovery

project_id = 'akvo-lumen'


def main(source_bucket, sink_bucket):
    """Create a daily transfer from Standard to Nearline Storage class."""
    storagetransfer = googleapiclient.discovery.build('storagetransfer', 'v1')
    start_date = datetime.date.today()
    transfer_job = {
        'description':
            'From {source_bucket} to {sink_bucket} on {date}'.format(source_bucket=source_bucket,
                                                                     sink_bucket=sink_bucket, date=start_date),
        'status': 'ENABLED',
        'projectId': project_id,
        'schedule': {
            'scheduleStartDate': {
                'day': start_date.day,
                'month': start_date.month,
                'year': start_date.year
            },
            'scheduleEndDate': {
                'day': start_date.day,
                'month': start_date.month,
                'year': start_date.year
            }
        },
        'transferSpec': {
            'gcsDataSource': {
                'bucketName': source_bucket
            },
            'gcsDataSink': {
                'bucketName': sink_bucket
            },
            # 'objectConditions': {
            #     'minTimeElapsedSinceLastModification': '2592000s'  # 30 days
            # },
            'transferOptions': {
                'deleteObjectsUniqueInSink': 'false',
                'overwriteObjectsAlreadyExistingInSink': 'false',
                'deleteObjectsFromSourceAfterTransfer': 'false'
            }
        }
    }
    return storagetransfer.transferJobs().create(body=transfer_job).execute()


def sync_status(job_name):
    storagetransfer = googleapiclient.discovery.build('storagetransfer', 'v1')
    filterString = (
        '{{"project_id": "{project_id}", '
        '"job_names": ["{job_name}"]}}'
    ).format(project_id=project_id, job_name=job_name)
    execute = storagetransfer.transferOperations().list(name="transferOperations", filter=filterString).execute()
    print('-----------: {}'.format(json.dumps(execute), indent=4, sort_keys=True))
    return execute['operations'][0] if 'operations' in execute else {}


def wait_til_ready(job_name):
    """Review the transfer operations associated with a transfer job."""
    while 'done' not in sync_status(job_name) or not sync_status(job_name)['done']:
        print('Waiting for sync to finish')
        time.sleep(10)
    sync_result = sync_status(job_name)
    print('Transfer job finish: {}'.format(json.dumps(sync_result), indent=4, sort_keys=True))
    if 'error' in sync_result:
        print('Google Storage failed!: {}'.format(json.dumps(sync_result, indent=4, sort_keys=True)))
    else:
        print('Google Storage sync done!')


job = main('akvo-rsr-training3-media-files', 'akvo-rsr-test-media-files')
print('Transfer job created: {}'.format(json.dumps(job, indent=4, sort_keys=True)))
wait_til_ready(job['name'])
