import boto3
import json

def lambda_handler(event, context):
    evt = json.dumps(event)
    if "message2" in evt:
        sns = boto3.client('sns', region_name='us-west-2')
        response = sns.publish(
            TopicArn = 'arn:aws:sns:us-west-2:729220473028:EID_Project3',
            Message = evt)
    else:
        sqs = boto3.resource('sqs')
        queue = sqs.get_queue_by_name(QueueName='EID_Project3')
        response = queue.send_message(MessageBody=evt)
        