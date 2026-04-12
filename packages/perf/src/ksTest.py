import json
from scipy.stats import ks_2samp

with open('src/ksTestData.json', 'r') as f:
    data = json.load(f)

diffA = data['diffA']
diffB = data['diffB']

print('Different distributions:')
statistic2, p_value2 = ks_2samp(diffA, diffB, mode="exact")
print('KS statistic:', statistic2)
print('KS p-value:', p_value2)
