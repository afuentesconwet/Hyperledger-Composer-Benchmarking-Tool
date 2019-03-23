import sys
import statistics

f = open("10asset1s", "r")
f2 = open("10asset1s", "r")

offerTimes = []
dataTimes = []
acquiTimes = []
payTimes = []
acceptTimes = []

avgOffer = 0
avgData = 0
avgAcqui = 0
avgAccept = 0
avgPay = 0

for l in f.readlines():
	if "Created a new Offering in" in l:
		words = l.split()
		offerTimes.append(int(words[-1]))
		for elem in offerTimes:
			avgOffer += elem

	if "Created a new Dataset in" in l:
		words = l.split()
		dataTimes.append(int(words[-1]))
		for elem in dataTimes:
			avgData += elem

	if "Acquisition created in" in l:
		words = l.split()
		acquiTimes.append(int(words[-1]))
		for elem in acquiTimes:
			avgAcqui += elem

	if "Accepted Agreement in" in l:
		words = l.split()
		acceptTimes.append(int(words[-1]))
		for elem in acceptTimes:
			avgAccept += elem

	if "Payment Completed in" in l:
		words = l.split()
		payTimes.append(int(words[-1]))
		for elem in payTimes:
			avgPay += elem

print("Offer Times: {}".format(offerTimes))
print("Dataset Times: {}".format(dataTimes))
print("Acquisition Times: {}".format(acquiTimes))
print("Accept Times: {}".format(acceptTimes))
print("Payment Times: {}".format(payTimes))

print("Created {} Offerings in {} s. Jitter: {}. AverageLatency: {} s. Throughput: {} tx/s.".format(
	len(offerTimes), sum(offerTimes)/1000, statistics.stdev(offerTimes), (sum(offerTimes)/1000)/len(offerTimes), len(offerTimes)/(sum(offerTimes)/1000)))
print("Accepted {} Agreements in {} s. Jitter: {}. AverageLatency: {} s. Throughput: {} tx/s.".format(
	len(acceptTimes), sum(acceptTimes)/1000, statistics.stdev(acceptTimes), (sum(acceptTimes)/1000)/len(acceptTimes), len(acceptTimes)/(sum(acceptTimes)/1000)))
print("Confirmed {} Payments in {} s. Jitter: {}. AverageLatency: {} s. Throughput: {} tx/s.".format(
	len(payTimes), sum(payTimes)/1000, statistics.stdev(payTimes), (sum(payTimes)/1000)/len(payTimes), len(payTimes)/(sum(payTimes)/1000)))
print("Created {} Datasets in {} s. Jitter: {}. AverageLatency: {} s. Throughput: {} tx/s.".format(
	len(dataTimes), sum(dataTimes)/1000, statistics.stdev(dataTimes), (sum(dataTimes)/1000)/len(dataTimes), len(dataTimes)/(sum(dataTimes)/1000)))
print("Created {} Acquisitions in {} s. Jitter: {}. AverageLatency: {} s. Throughput: {} tx/s.".format(
	len(acquiTimes), sum(acquiTimes)/1000, statistics.stdev(acquiTimes), (sum(acquiTimes)/1000)/len(acquiTimes), len(acquiTimes)/(sum(acquiTimes)/1000)))

nAssets = len(offerTimes) + len(acceptTimes) + len(payTimes) + len(dataTimes) + len(acquiTimes)
#elapsed = int(f2.readlines()[-1].split()[-1])

elapsed = 618550

print("Validated {} Tx in {} s. Whole Throughput: {} tx/s.".format(nAssets, elapsed/1000, nAssets/(elapsed/1000)))
